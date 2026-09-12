using Planner.Application.Common.Models.Projects;
using Planner.Domain.Entities;
using WitcherKM.Common.Orm.Repositories.Abstractions;

namespace Planner.Infrastructure.Repositories;

public interface IProjectRepository : IEntityRepository<Project>
{
    Task<IEnumerable<ProjectNameIdModel>> GetProjectNameAndIdsAsync(CancellationToken cancellationToken);
}