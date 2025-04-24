using Tempo_BLL.Models;

namespace Tempo_BLL.Interfaces;

public interface IOrderService : IGenericService<OrderModel>
{
    Task<List<OrderModel>> GetWaitersOrders(Guid id, CancellationToken cancellationToken);
}
