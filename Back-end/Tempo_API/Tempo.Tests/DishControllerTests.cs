using AutoMapper;
using FluentAssertions;
using Moq;
using System.Linq.Expressions;
using Tempo_API.Controllers;
using Tempo_API.DTOs.DishDtos;
using Tempo_BLL.Interfaces;
using Tempo_BLL.Models;

namespace Tempo.Tests;
public class DishControllerTests
{
    private readonly Mock<IDishService> _serviceMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly DishController _controller;

    public DishControllerTests()
    {
        _serviceMock = new Mock<IDishService>();
        _mapperMock = new Mock<IMapper>();
        _controller = new DishController(_serviceMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task GetByQuery_ReturnsFilteredResults()
    {
        // Arrange
        var query = "test";
        var dishes = new List<DishModel>
        {
            new() { Name = "Test Dish 1" },
            new() { Name = "Test Dish 2" },
            new() { Name = "Another Dish" }
        };

        _serviceMock.Setup(x => x.GetByPredicate(
                It.IsAny<Expression<Func<DishModel, bool>>>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(dishes.Where(d => d.Name.Contains(query, StringComparison.OrdinalIgnoreCase)).ToList());

        _mapperMock.Setup(x => x.Map<List<DishDto>>(It.IsAny<List<DishModel>>()))
            .Returns((List<DishModel> source) => source.Select(d => new DishDto { Name = d.Name }).ToList());

        // Act
        var result = await _controller.GetByQuery(CancellationToken.None, query);

        // Assert
        result.Should().HaveCount(2);
        result.Should().OnlyContain(d => d.Name.Contains(query, StringComparison.OrdinalIgnoreCase));
    }
}