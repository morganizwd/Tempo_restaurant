using AutoMapper;
using Tempo_BLL.Interfaces;
using Tempo_BLL.Models;
using Tempo_DAL.Entities;
using Tempo_DAL.Interfaces;

namespace Tempo_BLL.Services;

public class OrderService : GenericService<OrderModel, OrderEntity>, IOrderService
{
    private readonly IDishOrderRepository _DishRepository;
    private readonly IDrinkOrderRepository _DrinkRepository;
    private readonly IOrderRepository _OrderRepository;
    private readonly IMapper _mapper;

    public OrderService(IMapper mapper, IOrderRepository repository,
        IDishOrderRepository dishRepository, IDrinkOrderRepository drinkRepository) : base(mapper, repository)
    {
        _DishRepository = dishRepository;
        _DrinkRepository = drinkRepository;
        _OrderRepository = repository;
        _mapper = mapper;
    }

    public override async Task<OrderModel> Create(OrderModel model, CancellationToken cancellationToken)
    {
        var result = await base.Create(model, cancellationToken);
        foreach (var drinkId in model.DrinksId)
        {
            if (!result.DrinksId.Contains(drinkId))
            {
                var count = model.DrinksId.Count(id => id == drinkId);
                await _DrinkRepository.Create(new DrinkOrderEntity { DrinkId = drinkId, OrderId = result.Id, Number = count }, cancellationToken);
                result.DrinksId.Add(drinkId);
            }
        }
        foreach (var dishId in model.DishesId)
        {
            if (!result.DishesId.Contains(dishId))
            {
                var count = model.DishesId.Count(id => id == dishId);
                await _DishRepository.Create(new DishOrderEntity { DishId = dishId, OrderId = result.Id, Number = count }, cancellationToken);
                result.DishesId.Add(dishId);
            }
        }
        return result;
    }

    public async Task<List<OrderModel>> GetWaitersOrders(Guid id, CancellationToken cancellationToken)
    {
        var orderEntities = await _OrderRepository.GetWaitersOrders(id, cancellationToken);

        return _mapper.Map<List<OrderModel>>(orderEntities);
    }
}
