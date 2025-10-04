using Tempo_BLL.Models;

namespace Tempo_BLL.Interfaces;

public interface IOrderService : IGenericService<OrderModel>
{
    Task<List<OrderModel>> GetWaitersOrders(Guid id, CancellationToken cancellationToken);
    Task<TimeSpan> GetWaitTime(Guid id, CancellationToken cancellationToken);
    Task<List<OrderModel>> GetByCookId(Guid id, CancellationToken cancellationToken);
}
