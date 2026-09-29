using WitcherKM.Common.Orm.Repositories.Abstractions;
using WitcherKM.Planner.Domain.Entities;
namespace WitcherKM.Planner.Infrastructure.Repositories;
public interface ITaskRepository : IEntityRepository<TaskItem>
{
    Task<IEnumerable<TaskItem>> GetAllWithRelationsAsync(long? featureId, CancellationToken cancellationToken);
    Task<TaskItem?> GetByIdWithRelationsAsync(long taskId, CancellationToken cancellationToken);
}
