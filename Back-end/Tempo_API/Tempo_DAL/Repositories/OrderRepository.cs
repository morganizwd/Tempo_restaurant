using Microsoft.EntityFrameworkCore;
using Tempo_DAL.Entities;
using Tempo_DAL.Interfaces;
using Tempo_Shared.Enums;
using Tempo_Shared.Exeption;

namespace Tempo_DAL.Repositories;

public class OrderRepository : GenericRepository<OrderEntity>, IOrderRepository
{
    public OrderRepository(TempoDbContext dbcontext) : base(dbcontext)
    {
    }

    public Task<List<OrderEntity>> GetWaitersOrders(Guid waiterId, CancellationToken cancellationToken)
    {
        var data = dbSet
            .AsNoTracking()
            .Where(p => p.Table.WaiterId == waiterId && p.Status != OrderStatus.Ready)
            .Include(e => e.Table)
            .Include(e => e.Dishes).ThenInclude(e => e.Dish).ThenInclude(d => d.TablewareList).ThenInclude(t => t.Tableware)
            .Include(e => e.Drinks).ThenInclude(e => e.Drink)
            .Include(e => e.User);
        return data.ToListAsync(cancellationToken);
    }

    public override Task<List<OrderEntity>> GetAll(CancellationToken cancellationToken, out int total, out int count)
    {
        var data = dbSet
            .AsNoTracking()
            .Include(e => e.Table)
            .Include(e => e.Dishes).ThenInclude(e => e.Dish)
            .Include(e => e.Drinks).ThenInclude(e => e.Drink)
            .Include(e => e.User);

        total = data.Count();
        count = 1;
        return data.ToListAsync(cancellationToken);
    }

    public override async Task<OrderEntity> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await dbSet
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Include(e => e.Table)
            .Include(e => e.Dishes).ThenInclude(e => e.Dish)
            .Include(e => e.Drinks).ThenInclude(e => e.Drink)
            .Include(e => e.User)
            .FirstOrDefaultAsync(cancellationToken);

        if (result == null)
        {
            throw new NotFoundException();
        }
        return result;
    }
}
