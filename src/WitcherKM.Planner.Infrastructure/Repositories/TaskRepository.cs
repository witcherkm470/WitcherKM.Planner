using WitcherKM.Common.Orm.Repositories;
using Microsoft.EntityFrameworkCore;
using WitcherKM.Planner.Domain.Entities;
namespace WitcherKM.Planner.Infrastructure.Repositories;
public class TaskRepository(PlannerDbContext dbContext) : EntityRepository<TaskItem, PlannerDbContext>(dbContext), ITaskRepository
{
    public async Task<IEnumerable<TaskItem>> GetAllWithRelationsAsync(long? featureId, CancellationToken cancellationToken)
    {
        var query = DbSet.AsNoTracking().Include(x => x.Feature).ThenInclude(x => x.Project).AsQueryable();
        if (featureId.HasValue) query = query.Where(x => x.FeatureId == featureId.Value);
        return await query.ToListAsync(cancellationToken);
    }
    public Task<TaskItem?> GetByIdWithRelationsAsync(long taskId, CancellationToken cancellationToken) => DbSet.AsNoTracking().Include(x => x.Feature).ThenInclude(x => x.Project).SingleOrDefaultAsync(x => x.Id == taskId, cancellationToken);
}
