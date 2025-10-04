using Tempo_DAL.Entities;

namespace Tempo_DAL.Interfaces;

public interface IOrderRepository : IGenericRepository<OrderEntity>
{
    Task<List<OrderEntity>> GetWaitersOrders(Guid waiterId, CancellationToken cancellationToken);
    Task<List<OrderEntity>> GetCookingOrders(CancellationToken cancellationToken);
}
