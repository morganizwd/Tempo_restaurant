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

    [HttpGet("cook/{cookId}")]
    public async Task<List<OrderDto>> GetCookOrders(Guid cookId, CancellationToken cancellationToken)
    {
        var models = await _orderService.GetCookOrders(cookId, cancellationToken);
        return _mapper.Map<List<OrderDto>>(models);
    }

    [HttpGet("waiter/{id}")]

    public async Task<List<OrderDto>> GetWaitersOrders(Guid id, CancellationToken cancellationToken)
    {
        var models = await _orderService.GetWaitersOrders(id, cancellationToken);
        return _mapper.Map<List<OrderDto>>(models);
    }
}
