using MediatR;
using Planner.Application.Common.Models.Feature;
using Planner.Infrastructure.Repositories;

namespace Planner.Application.Features.Queries;

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