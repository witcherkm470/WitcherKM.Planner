using Microsoft.EntityFrameworkCore;
using WitcherKM.Planner.Application.Common.Models.Projects;
using WitcherKM.Planner.Domain.Entities;
using WitcherKM.Common.Orm.Repositories;

namespace WitcherKM.Planner.Infrastructure.Repositories;

public class ProjectRepository : EntityRepository<Project, PlannerDbContext>, IProjectRepository
{
    public ProjectRepository(PlannerDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IEnumerable<ProjectNameIdModel>> GetProjectNameAndIdsAsync(CancellationToken cancellationToken)
    {
        return await DbSet.Select(project => new ProjectNameIdModel
        {
            Id = project.Id,
            Name = project.Name
        }).ToListAsync(cancellationToken);
    }
}