using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Tempo_API.DTOs.EmployeeDtos;
using Tempo_BLL.Interfaces;
using Tempo_BLL.Models;

namespace Tempo_API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EmployeeController : GenericController<EmployeeModel, EmployeeDto, CreateEmployeeDto>
{
    private readonly IEmployeeService _service;

    public EmployeeController(IEmployeeService service, IMapper mapper) : base(service, mapper)
    {
        _service = service;
    }

    [HttpPost("login")]
    public async Task<EmployeeDto> Login(CreateEmployeeDto dto, CancellationToken cancellationToken)
    {
        var model = await _service.Login(_mapper.Map<EmployeeModel>(dto), cancellationToken);
        return _mapper.Map<EmployeeDto>(model);
    }
}
