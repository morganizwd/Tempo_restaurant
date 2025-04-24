using Tempo_BLL.Models;

namespace Tempo_BLL.Interfaces;

public interface IEmployeeService : IGenericService<EmployeeModel>
{
    Task<EmployeeModel?> Login(EmployeeModel model, CancellationToken cancellationToken);
}
