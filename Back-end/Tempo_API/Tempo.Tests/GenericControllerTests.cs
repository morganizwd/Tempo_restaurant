using AutoMapper;
using FluentAssertions;
using Moq;
using Tempo_API.Controllers;
using Tempo_API.Interfaces;
using Tempo_BLL.Interfaces;
using Tempo_BLL.Models;
using Tempo_Shared.Exeption;

namespace Tempo.Tests;

public class GenericControllerTests
{
    private readonly Mock<IGenericService<TestModel>> _serviceMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly TestGenericController _controller;

    public GenericControllerTests()
    {
        _serviceMock = new Mock<IGenericService<TestModel>>();
        _mapperMock = new Mock<IMapper>();
        _controller = new TestGenericController(_serviceMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsPaginatedResult()
    {
        // Arrange
        var testData = new List<TestModel> { new() { Id = Guid.NewGuid() } };
        var paginated = new PaginatedModel<TestModel> { Items = testData, Total = 1 };

        _serviceMock.Setup(x => x.GetAll(It.IsAny<CancellationToken>(), It.IsAny<int?>(), It.IsAny<int?>()))
            .ReturnsAsync(paginated);

        _mapperMock.Setup(x => x.Map<TestDto>(It.IsAny<TestModel>()))
            .Returns(new TestDto());

        // Act
        var result = await _controller.GetAll(CancellationToken.None, 1, 1);

        // Assert
        result.Should().NotBeNull();
        result.Items.Should().HaveCount(1);
    }

    [Fact]
    public async Task GetById_ReturnsMappedDto()
    {
        // Arrange
        var id = Guid.NewGuid();
        var model = new TestModel { Id = id };
        var dto = new TestDto();

        _serviceMock.Setup(x => x.GetById(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(model);

        _mapperMock.Setup(x => x.Map<TestDto>(model))
            .Returns(dto);

        // Act
        var result = await _controller.GetById(id, CancellationToken.None);

        // Assert
        result.Should().BeSameAs(dto);
    }

    [Fact]
    public async Task Create_ValidDto_ReturnsMappedResult()
    {
        // Arrange
        var createDto = new CreateTestDto { Name = "Test Item" };
        var model = new TestModel { Id = Guid.NewGuid(), Name = "Test Item" };
        var expectedDto = new TestDto { Id = model.Id, Name = "Test Item" };

        _mapperMock.Setup(x => x.Map<TestModel>(createDto))
            .Returns(model);

        _serviceMock.Setup(x => x.Create(model, It.IsAny<CancellationToken>()))
            .ReturnsAsync(model);

        _mapperMock.Setup(x => x.Map<TestDto>(model))
            .Returns(expectedDto);

        // Act
        var result = await _controller.Create(createDto, CancellationToken.None);

        // Assert
        result.Should().BeEquivalentTo(expectedDto);
        _serviceMock.Verify(x => x.Create(model, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Update_ExistingItem_ReturnsUpdatedDto()
    {
        // Arrange
        var id = Guid.NewGuid();
        var updateDto = new TestDto { Id = id, Name = "Updated Name" };
        var model = new TestModel { Id = id, Name = "Updated Name" };
        var updatedModel = new TestModel { Id = id, Name = "Updated Name" };

        _mapperMock.Setup(x => x.Map<TestModel>(updateDto))
            .Returns(model);

        _serviceMock.Setup(x => x.Update(id, model, It.IsAny<CancellationToken>()))
            .ReturnsAsync(updatedModel);

        _mapperMock.Setup(x => x.Map<TestDto>(updatedModel))
            .Returns(updateDto);

        // Act
        var result = await _controller.Update(id, updateDto, CancellationToken.None);

        // Assert
        result.Should().BeEquivalentTo(updateDto);
        _serviceMock.Verify(x => x.Update(id, model, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Delete_ExistingItem_InvokesService()
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

    [Fact]
    public Task Delete_NonExistingItem_ThrowsNotFoundException()
    {
        // Arrange
        var id = Guid.NewGuid();
        _serviceMock.Setup(x => x.Delete(id, It.IsAny<CancellationToken>()))
            .ThrowsAsync(new NotFoundException());

        // Act & Assert
        return Assert.ThrowsAsync<NotFoundException>(() =>
            _controller.Delete(id, CancellationToken.None));
    }

    [Fact]
    public async Task Create_VerifyMappingConfiguration()
    {
        // Arrange
        var createDto = new CreateTestDto { Name = "Test Mapping" };
        var model = new TestModel { Name = "Test Mapping" };

        _mapperMock.Setup(x => x.Map<TestModel>(createDto))
            .Returns(model)
            .Verifiable();

        _serviceMock.Setup(x => x.Create(It.IsAny<TestModel>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(model);

        // Act
        await _controller.Create(createDto, CancellationToken.None);

        // Assert
        _mapperMock.Verify(x => x.Map<TestModel>(createDto), Times.Once);
    }

    public class TestModel : BaseModel
    {
        public string Name { get; set; }
    }

    public interface ITestDto : IBaseDto
    {
        string Name { get; set; }
    }

    public class TestDto : ITestDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

    public class CreateTestDto : ITestDto
    {
        public string Name { get; set; }
    }

    public class TestGenericController : GenericController<TestModel, TestDto, CreateTestDto>
    {
        public TestGenericController(IGenericService<TestModel> service, IMapper mapper)
            : base(service, mapper) { }
    }
}