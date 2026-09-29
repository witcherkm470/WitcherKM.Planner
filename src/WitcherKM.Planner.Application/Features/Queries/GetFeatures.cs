using MediatR;
using WitcherKM.Planner.Application.Common.Models.Feature;
using WitcherKM.Planner.Infrastructure.Repositories;

namespace WitcherKM.Planner.Application.Features.Queries;

public class GetFeatures
{
    public record Query : IRequest<IEnumerable<FeatureModel>>;

    public class Handler(IFeatureRepository featureRepository) : IRequestHandler<Query, IEnumerable<FeatureModel>>
    {
        public async Task<IEnumerable<FeatureModel>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await featureRepository.GetAllFeaturesWithProjectNameAsync(cancellationToken);
        }
    }
}