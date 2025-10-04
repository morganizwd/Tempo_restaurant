using AutoMapper;
using FluentAssertions;
using Moq;
using Tempo_API.Controllers;
using Tempo_API.DTOs.EmployeeDtos;
using Tempo_BLL.Interfaces;
using Tempo_BLL.Models;

namespace Tempo.Tests;
public class EmployeeControllerTests
{
    private readonly Mock<IEmployeeService> _serviceMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly EmployeeController _controller;

    public EmployeeControllerTests()
    {
        _serviceMock = new Mock<IEmployeeService>();
        _mapperMock = new Mock<IMapper>();
        _controller = new EmployeeController(_serviceMock.Object, _mapperMock.Object);
    }

    // Тесты для унаследованных методов CRUD

    [Fact]
    public async Task GetAll_ReturnsListOfEmployees()
    {
        // Arrange
        var employees = new List<EmployeeModel>
            {
                new() { Id = Guid.NewGuid(), Login = "John" },
                new() { Id = Guid.NewGuid(), Login = "Jane" }
            };

        var paginatedResult = new PaginatedModel<EmployeeModel>
        {
            Items = employees,
            Total = 2
        };

        _serviceMock.Setup(x => x.GetAll(It.IsAny<CancellationToken>(), null, null))
            .ReturnsAsync(paginatedResult);

        _mapperMock.Setup(x => x.Map<EmployeeDto>(It.IsAny<EmployeeModel>()))
            .Returns((EmployeeModel m) => new EmployeeDto { Id = m.Id, Login = m.Login });

        // Act
        var result = await _controller.GetAll(CancellationToken.None, null, null);

        // Assert
        result.Items.Should().HaveCount(2);
        result.Total.Should().Be(2);
    }

    [Fact]
    public async Task GetById_ExistingEmployee_ReturnsEmployee()
    {
        // Arrange
        var id = Guid.NewGuid();
        var employee = new EmployeeModel { Id = id, Login = "John" };
        var employeeDto = new EmployeeDto { Id = id, Login = "John" };

        _serviceMock.Setup(x => x.GetById(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(employee);

        _mapperMock.Setup(x => x.Map<EmployeeDto>(employee))
            .Returns(employeeDto);

        // Act
        var result = await _controller.GetById(id, CancellationToken.None);

        // Assert
        result.Should().BeEquivalentTo(employeeDto);
    }

    // Тесты для метода Login

    [Fact]
    public async Task Login_ValidCredentials_ReturnsEmployeeDto()
    {
        // Arrange
        var loginDto = new CreateEmployeeDto
        {
            Login = "john@example.com",
            Password = "correctPassword"
        };

        var employeeModel = new EmployeeModel
        {
            Id = Guid.NewGuid(),
            Login = "john@example.com"
        };

        var expectedDto = new EmployeeDto
        {
            Id = employeeModel.Id,
            Login = "john@example.com"
        };

        _mapperMock.Setup(x => x.Map<EmployeeModel>(loginDto))
            .Returns(new EmployeeModel
            {
                Login = loginDto.Login,
                Password = loginDto.Password
            });

        _serviceMock.Setup(x => x.Login(It.IsAny<EmployeeModel>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(employeeModel);

        _mapperMock.Setup(x => x.Map<EmployeeDto>(employeeModel))
            .Returns(expectedDto);

        // Act
        var result = await _controller.Login(loginDto, CancellationToken.None);

        // Assert
        result.Should().BeEquivalentTo(expectedDto);
        _serviceMock.Verify(x => x.Login(It.Is<EmployeeModel>(m =>
            m.Login == loginDto.Login && m.Password == loginDto.Password),
            CancellationToken.None));
    }

    [Fact]
    public Task Login_InvalidCredentials_ThrowsUnauthorizedException()
    {
        // Arrange
        var loginDto = new CreateEmployeeDto
        {
            Login = "wrong@example.com",
            Password = "wrongPassword"
        };

        _mapperMock.Setup(x => x.Map<EmployeeModel>(loginDto))
            .Returns(new EmployeeModel
            {
                Login = loginDto.Login,
                Password = loginDto.Password
            });

        _serviceMock.Setup(x => x.Login(It.IsAny<EmployeeModel>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new UnauthorizedAccessException("Invalid credentials"));

        // Act & Assert
        return Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _controller.Login(loginDto, CancellationToken.None));
    }

    // Дополнительные тесты для CRUD операций

    [Fact]
    public async Task Create_ValidEmployee_ReturnsCreatedEmployee()
    {
        // Arrange
        var createDto = new CreateEmployeeDto
        {
            Login = "new@example.com",
            Password = "password"
        };

        var employeeModel = new EmployeeModel
        {
            Id = Guid.NewGuid(),
            Login = "new@example.com"
        };

        var expectedDto = new EmployeeDto
        {
            Id = employeeModel.Id,
            Login = "new@example.com"
        };

        _mapperMock.Setup(x => x.Map<EmployeeModel>(createDto))
            .Returns(employeeModel);

        _serviceMock.Setup(x => x.Create(employeeModel, It.IsAny<CancellationToken>()))
            .ReturnsAsync(employeeModel);

        _mapperMock.Setup(x => x.Map<EmployeeDto>(employeeModel))
            .Returns(expectedDto);

        // Act
        var result = await _controller.Create(createDto, CancellationToken.None);

        // Assert
        result.Should().BeEquivalentTo(expectedDto);
    }

    [Fact]
    public async Task Update_ExistingEmployee_ReturnsUpdatedEmployee()
    {
        // Arrange
        var id = Guid.NewGuid();
        var updateDto = new EmployeeDto
        {
            Id = id,
            Login = "updated@example.com"
        };

        var employeeModel = new EmployeeModel
        {
            Id = id,
            Login = "updated@example.com"
        };

        _mapperMock.Setup(x => x.Map<EmployeeModel>(updateDto))
            .Returns(employeeModel);

        _serviceMock.Setup(x => x.Update(id, employeeModel, It.IsAny<CancellationToken>()))
            .ReturnsAsync(employeeModel);

        _mapperMock.Setup(x => x.Map<EmployeeDto>(employeeModel))
            .Returns(updateDto);

        // Act
        var result = await _controller.Update(id, updateDto, CancellationToken.None);

        // Assert
        result.Should().BeEquivalentTo(updateDto);
    }

    [Fact]
    public async Task Delete_ExistingEmployee_InvokesService()
    {
        // Arrange
        var id = Guid.NewGuid();
        _serviceMock.Setup(x => x.Delete(id, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        await _controller.Delete(id, CancellationToken.None);

        // Assert
        _serviceMock.Verify(x => x.Delete(id, It.IsAny<CancellationToken>()), Times.Once);
    }
}