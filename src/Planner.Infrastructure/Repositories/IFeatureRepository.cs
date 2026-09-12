using Planner.Application.Common.Models.Feature;
using Planner.Application.Common.Models.Projects;
using Planner.Domain.Entities;
using WitcherKM.Common.Orm.Repositories.Abstractions;

namespace Planner.Infrastructure.Repositories;

public interface IFeatureRepository : IEntityRepository<Feature>
{
    Task<bool> AnyExistsByProjectIdAsync(long projectId, CancellationToken cancellationToken);
    
    Task<int> GetOpenedFeaturesCountByProjectIdAsync(long projectId, CancellationToken cancellationToken);
    
    Task<IEnumerable<FeatureModel>> GetAllFeaturesWithProjectNameAsync(CancellationToken cancellationToken);
    
    Task<IEnumerable<ProjectFeaturesModel>> GetAllByProjectIdAsync(long projectId, CancellationToken cancellationToken);
}