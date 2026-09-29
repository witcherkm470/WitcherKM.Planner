using WitcherKM.Common.Orm.Repositories;
using WitcherKM.Planner.Domain.Entities;

namespace WitcherKM.Planner.Infrastructure.Repositories;

public class IdeaRepository : EntityRepository<Idea, PlannerDbContext>, IIdeaRepository
{
    public IdeaRepository(PlannerDbContext dbContext) : base(dbContext)
    {
    }
}