using Microsoft.EntityFrameworkCore;
using Planner.Domain.Entities;
using WitcherKM.Common.Orm.Repositories;

namespace Planner.Infrastructure.Repositories;

public class FeatureRepository : EntityRepository<Feature, PlannerDbContext>, IFeatureRepository
{
    public FeatureRepository(PlannerDbContext dbContext) : base(dbContext)
    {
    }


    public async Task<bool> AnyExistsByProjectIdAsync(long projectId, CancellationToken cancellationToken)
    {
        return await DbSet.AnyAsync(feature => feature.ProjectId == projectId, cancellationToken);
    }
}