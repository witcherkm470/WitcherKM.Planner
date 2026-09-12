using Microsoft.EntityFrameworkCore;
using Planner.Domain.Entities;
using Planner.Domain.Enums;
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

    public async Task<int> GetOpenedFeaturesCountByProjectIdAsync(long projectId, CancellationToken cancellationToken)
    {
        return await DbSet
            .Where(feature => feature.ProjectId == projectId && feature.FeatureStatus == FeatureStatus.Opened)
            .CountAsync(cancellationToken);
    }
}