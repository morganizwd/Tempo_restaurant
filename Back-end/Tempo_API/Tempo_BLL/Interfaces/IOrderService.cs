using Tempo_BLL.Models;

namespace Tempo_BLL.Interfaces;

public interface IOrderService : IGenericService<OrderModel>
{
    Task<List<OrderModel>> GetCookOrders(Guid cookId, CancellationToken cancellationToken);
    Task<List<OrderModel>> GetWaitersOrders(Guid id, CancellationToken cancellationToken);
}
