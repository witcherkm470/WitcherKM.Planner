using Planner.Domain.Entities;
using WitcherKM.Common.Orm.Repositories;

namespace Planner.Infrastructure.Repositories;

public class FeatureRepository : EntityRepository<Feature, PlannerDbContext>, IFeatureRepository
{
    public FeatureRepository(PlannerDbContext dbContext) : base(dbContext)
    {
    }
}