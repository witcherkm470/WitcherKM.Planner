using Microsoft.EntityFrameworkCore;
using Planner.Domain.Entities;
using WitcherKM.Common.Orm.Repositories;

namespace Planner.Infrastructure.Repositories;

public class ProjectRepository : EntityRepository<Project, PlannerDbContext>, IProjectRepository
{
    public ProjectRepository(PlannerDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IEnumerable<Project>> GetAllWithFeaturesAsync(CancellationToken cancellationToken)
    {
        return await DbSet.Include(x => x.Features).ToListAsync(cancellationToken);
    }
}