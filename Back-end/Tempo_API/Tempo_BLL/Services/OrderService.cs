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
    private readonly ICookRepository _CookRepository;
    private readonly IMapper _mapper;

    public OrderService(IMapper mapper, IOrderRepository repository,
        IDishOrderRepository dishRepository, IDrinkOrderRepository drinkRepository, ICookRepository cookRepository) : base(mapper, repository)
    {
        _DishRepository = dishRepository;
        _DrinkRepository = drinkRepository;
        _OrderRepository = repository;
        _mapper = mapper;
        _CookRepository = cookRepository;
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

    public async Task<TimeSpan> GetWaitTime(Guid id, CancellationToken cancellationToken)
    {
        var order = _mapper.Map<OrderModel>(await _repository.GetById(id, cancellationToken));

        var aproxTime = order.Dishes.Sum(dishOrder => dishOrder.Dish!.Approx_time * dishOrder.Number);

        DateTime estimatedReadyTime = order.CreatedAt.AddMinutes(aproxTime);

        TimeSpan remainingTime = estimatedReadyTime - DateTime.UtcNow;

        return remainingTime > TimeSpan.Zero ? remainingTime : TimeSpan.Zero;
    }
    public async Task<List<OrderModel>> GetByCookId(Guid id, CancellationToken cancellationToken)
    {
        var orders = _mapper.Map<List<OrderModel>>(await _OrderRepository.GetCookingOrders(cancellationToken));
        var cook = _mapper.Map<CookModel>(await _CookRepository.GetById(id, cancellationToken));

        foreach (var order in orders)
        {
            order.Dishes = order.Dishes.Where(d => d.Dish!.CategoryId == cook.CategoryId).ToList();
            order.Drinks = order.Drinks.Where(d => d.Drink!.CategoryId == cook.CategoryId).ToList();
        }

        return orders;
    }
}
