using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Tempo_API.DTOs.OrderDtos;
using Tempo_BLL.Interfaces;
using Tempo_BLL.Models;

namespace Tempo_API.Controllers;
[Route("api/[controller]")]
[ApiController]
public class OrderController : GenericController<OrderModel, OrderDto, CreateOrderDto>
{

    private readonly IOrderService _orderService;
    private readonly IMapper _mapper;

    public OrderController(IOrderService service, IMapper mapper) : base(service, mapper)
    {
        _orderService = service;
        _mapper = mapper;
    }

    [HttpGet("waiter/{id}")]

    public async Task<List<OrderDto>> GetWaitersOrders(Guid id, CancellationToken cancellationToken)
    {
        var models = await _orderService.GetWaitersOrders(id, cancellationToken);
        return _mapper.Map<List<OrderDto>>(models);
    }

    [HttpGet("time/{id}")]

    public Task<TimeSpan> GetWaitTime(Guid id, CancellationToken cancellationToken)
    {
        return _orderService.GetWaitTime(id, cancellationToken);
    }

    [HttpGet("cook/{id}")]

    public async Task<List<OrderDto>> GetByCookId(Guid id, CancellationToken cancellationToken)
    {
        var models = await _orderService.GetByCookId(id, cancellationToken);
        return _mapper.Map<List<OrderDto>>(models);
    }
}
