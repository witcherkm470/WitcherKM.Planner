using MediatR;
using WitcherKM.Planner.Application.Common.Models.Projects;
using WitcherKM.Planner.Infrastructure.Repositories;

namespace WitcherKM.Planner.Application.Projects.Queries;

public class GetProjectFeatures
{
    public record Query(long ProjectId) : IRequest<IEnumerable<ProjectFeaturesModel>>;

    public class Handler(IFeatureRepository featureRepository) : IRequestHandler<Query, IEnumerable<ProjectFeaturesModel>>
    {
        public async Task<IEnumerable<ProjectFeaturesModel>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await featureRepository.GetAllByProjectIdAsync(request.ProjectId, cancellationToken);
        }
    }
}