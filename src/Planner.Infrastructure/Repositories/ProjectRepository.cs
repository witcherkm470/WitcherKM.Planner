using Microsoft.EntityFrameworkCore;
using Planner.Application.Common.Models.Projects;
using Planner.Domain.Entities;
using WitcherKM.Common.Orm.Repositories;

namespace Planner.Infrastructure.Repositories;

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