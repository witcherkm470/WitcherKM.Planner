using Planner.Domain.Entities;
using WitcherKM.Common.Orm.Repositories;

namespace Planner.Infrastructure.Repositories;

public class ProjectRepository : EntityRepository<Project, PlannerDbContext>, IProjectRepository
{
    public ProjectRepository(PlannerDbContext dbContext) : base(dbContext)
    {
    }
}