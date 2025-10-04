using AutoMapper;
using FluentAssertions;
using Moq;
using Tempo_API.Controllers;
using Tempo_API.DTOs.OrderDtos;
using Tempo_BLL.Interfaces;
using Tempo_BLL.Models;
using Tempo_DAL.Entities;
using Tempo_Shared.Enums;

namespace Tempo.Tests;
public class OrderControllerTests
{
    private readonly Mock<IOrderService> _serviceMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly OrderController _controller;

    public OrderControllerTests()
    {
        _serviceMock = new Mock<IOrderService>();
        _mapperMock = new Mock<IMapper>();
        _controller = new OrderController(_serviceMock.Object, _mapperMock.Object);
    }

    // Тесты для унаследованных методов CRUD

    [Fact]
    public async Task GetAll_ReturnsListOfOrders()
    {
        // Arrange
        var orders = new List<OrderModel>
            {
                new() { Id = Guid.NewGuid(), Status = OrderStatus.Ordered },
                new() { Id = Guid.NewGuid(), Status = OrderStatus.Ready }
            };

        var paginatedResult = new PaginatedModel<OrderModel>
        {
            Items = orders,
            Total = 2
        };

        _serviceMock.Setup(x => x.GetAll(It.IsAny<CancellationToken>(), null, null))
            .ReturnsAsync(paginatedResult);

        _mapperMock.Setup(x => x.Map<OrderDto>(It.IsAny<OrderModel>()))
            .Returns((OrderModel m) => new OrderDto { Id = m.Id, Status = m.Status });

        // Act
        var result = await _controller.GetAll(CancellationToken.None, null, null);

        // Assert
        result.Items.Should().HaveCount(2);
        result.Total.Should().Be(2);
    }

    // Тесты для специфических методов

    [Fact]
    public async Task GetWaitersOrders_ValidWaiterId_ReturnsFilteredOrders()
    {
        // Arrange
        var waiterId = Guid.NewGuid();
        var cancellationToken = CancellationToken.None;

        var testOrders = new List<OrderModel>
    {
        new OrderModel { Id = Guid.NewGuid(), Status = OrderStatus.Cooking},
        new OrderModel { Id = Guid.NewGuid(), Status = OrderStatus.Cooking},
        new OrderModel { Id = Guid.NewGuid(), Status = OrderStatus.Ready} // Should be filtered out
    };

        // Correct mock setup
        _serviceMock.Setup(x => x.GetWaitersOrders(waiterId, cancellationToken))
            .ReturnsAsync(testOrders.Where(o => o.Status != OrderStatus.Ready).ToList());

        // Correct mapper setup
        _mapperMock.Setup(x => x.Map<List<OrderDto>>(It.IsAny<List<OrderModel>>()))
            .Returns((List<OrderModel> source) => source.Select(o => new OrderDto
            {
                Id = o.Id,
                Status = o.Status,
            }).ToList());

        // Act
        var result = await _controller.GetWaitersOrders(waiterId, cancellationToken);

        // Assert
        result.Should().HaveCount(2);
        result.Should().OnlyContain(o => o.Status != OrderStatus.Ready);
    }

    [Fact]
    public async Task GetWaitersOrders_ReturnsEmptyListForWaiterWithNoActiveOrders()
    {
        // Arrange
        var waiterId = Guid.NewGuid();
        var cancellationToken = CancellationToken.None;

        _serviceMock.Setup(x => x.GetWaitersOrders(waiterId, cancellationToken))
            .ReturnsAsync(new List<OrderModel>());

        _mapperMock.Setup(x => x.Map<List<OrderDto>>(It.IsAny<List<OrderEntity>>()))
            .Returns(new List<OrderDto>());

        // Act
        var result = await _controller.GetWaitersOrders(waiterId, cancellationToken);

        // Assert
        result.Should().BeNullOrEmpty();
    }

    [Fact]
    public async Task GetWaitersOrders_OnlyReturnsOrdersForSpecifiedWaiter()
    {
        // Arrange
        var correctWaiterId = Guid.NewGuid();
        var wrongWaiterId = Guid.NewGuid();
        var cancellationToken = CancellationToken.None;

        // Create test data with proper model types
        var testOrders = new List<OrderModel>
    {
        new OrderModel
        {
            Id = Guid.NewGuid(),
            Status = OrderStatus.Cooking,
            Table = new TableModel { Id = Guid.NewGuid(), WaiterId = correctWaiterId }
        },
        new OrderModel
        {
            Id = Guid.NewGuid(),
            Status = OrderStatus.Cooking,
            Table = new TableModel { Id = Guid.NewGuid(), WaiterId = wrongWaiterId }
        }
    };

        // Setup service mock to return filtered orders
        _serviceMock.Setup(x => x.GetWaitersOrders(correctWaiterId, cancellationToken))
            .ReturnsAsync(testOrders.Where(o =>
                o.Table.WaiterId == correctWaiterId &&
                o.Status != OrderStatus.Ready)
            .ToList());

        // Setup mapper to convert OrderModel to OrderDto
        _mapperMock.Setup(x => x.Map<List<OrderDto>>(It.IsAny<List<OrderModel>>()))
            .Returns((List<OrderModel> source) => source.Select(o => new OrderDto
            {
                Id = o.Id,
                Status = o.Status,
                TableId = o.Table.Id,
            }).ToList());

        // Act
        var result = await _controller.GetWaitersOrders(correctWaiterId, cancellationToken);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(1);
    }

    [Fact]
    public async Task GetWaitersOrders_NoOrders_ReturnsEmptyList()
    {
        // Arrange
        var waiterId = Guid.NewGuid();
        var emptyList = new List<OrderModel>();

        _serviceMock.Setup(x => x.GetWaitersOrders(waiterId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(emptyList);

        _mapperMock.Setup(x => x.Map<List<OrderDto>>(emptyList))
            .Returns(new List<OrderDto>());

        // Act
        var result = await _controller.GetWaitersOrders(waiterId, CancellationToken.None);

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetWaitTime_ValidOrderId_ReturnsTimeSpan()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        var expectedWaitTime = TimeSpan.FromMinutes(15);

        _serviceMock.Setup(x => x.GetWaitTime(orderId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedWaitTime);

        // Act
        var result = await _controller.GetWaitTime(orderId, CancellationToken.None);

        // Assert
        result.Should().Be(expectedWaitTime);
        _serviceMock.Verify(x => x.GetWaitTime(orderId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public Task GetWaitTime_NonExistingOrder_ThrowsException()
    {
        // Arrange
        var orderId = Guid.NewGuid();

        _serviceMock.Setup(x => x.GetWaitTime(orderId, It.IsAny<CancellationToken>()))
            .ThrowsAsync(new KeyNotFoundException("Order not found"));

        // Act & Assert
        return Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _controller.GetWaitTime(orderId, CancellationToken.None));
    }

    // Дополнительные тесты для CRUD операций

    [Fact]
    public async Task Create_ValidOrder_ReturnsCreatedOrder()
    {
        // Arrange
        var createDto = new CreateOrderDto
        {
            TableId = Guid.NewGuid()
        };

        var orderModel = new OrderModel
        {
            Id = Guid.NewGuid(),
            TableId = createDto.TableId
        };

        var expectedDto = new OrderDto
        {
            Id = orderModel.Id,
            TableId = createDto.TableId
        };

        _mapperMock.Setup(x => x.Map<OrderModel>(createDto))
            .Returns(orderModel);

        _serviceMock.Setup(x => x.Create(orderModel, It.IsAny<CancellationToken>()))
            .ReturnsAsync(orderModel);

        _mapperMock.Setup(x => x.Map<OrderDto>(orderModel))
            .Returns(expectedDto);

        // Act
        var result = await _controller.Create(createDto, CancellationToken.None);

        // Assert
        result.Should().BeEquivalentTo(expectedDto);
    }

    [Fact]
    public async Task Update_ExistingOrder_ReturnsUpdatedOrder()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        var updateDto = new OrderDto
        {
            Id = orderId,
            Status = OrderStatus.Ready
        };

        var orderModel = new OrderModel
        {
            Id = orderId,
            Status = OrderStatus.Ready
        };

        _mapperMock.Setup(x => x.Map<OrderModel>(updateDto))
            .Returns(orderModel);

        _serviceMock.Setup(x => x.Update(orderId, orderModel, It.IsAny<CancellationToken>()))
            .ReturnsAsync(orderModel);

        _mapperMock.Setup(x => x.Map<OrderDto>(orderModel))
            .Returns(updateDto);

        // Act
        var result = await _controller.Update(orderId, updateDto, CancellationToken.None);

        // Assert
        result.Should().BeEquivalentTo(updateDto);
    }
}