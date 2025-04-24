using AutoMapper;
using Tempo_BLL.Interfaces;
using Tempo_BLL.Models;
using Tempo_DAL.Entities;
using Tempo_DAL.Interfaces;

namespace Tempo_BLL.Services;

public class EmployeesService : GenericService<EmployeeModel, EmployeeEntity>, IEmployeeService
{
    public EmployeesService(IMapper mapper, IEmployeeRepository repository) : base(mapper, repository)
    {
    }

    public async Task<EmployeeModel?> Login(EmployeeModel model, CancellationToken cancellationToken)
    {
        var search = await _repository.GetByPredicate(x => x.Login == model.Login && x.Password == model.Password, cancellationToken,
            [e => e.Waiter, e => e.Cook]);
        if (search.Count == 0)
        {
            return null;
        }
        return _mapper.Map<EmployeeModel>(search[0]);
    }

    public override async Task<EmployeeModel> Create(EmployeeModel model, CancellationToken cancellationToken)
    {
        var search = await _repository.GetByPredicate(x => x.Login == model.Login && x.Password == model.Password, cancellationToken);
        if (search.Count == 0)
        {
            return await base.Create(model, cancellationToken);
        }
        return _mapper.Map<EmployeeModel>(search[0]);
    }
}
