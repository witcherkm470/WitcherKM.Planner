using MediatR;
using Planner.Application.Common.Models.Projects;
using Planner.Infrastructure.Repositories;

namespace Planner.Application.Projects.Queries;

public class GetProjectNameAndIds
{
    public record Query : IRequest<IEnumerable<ProjectNameIdModel>>;

    public class Handler : IRequestHandler<Query, IEnumerable<ProjectNameIdModel>>
    {
        private readonly IProjectRepository _projectRepository;

        public Handler(IProjectRepository projectRepository, IFeatureRepository featureRepository)
        {
            _projectRepository = projectRepository;
        }

        public async Task<IEnumerable<ProjectNameIdModel>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await _projectRepository.GetProjectNameAndIdsAsync(cancellationToken);
        }
    }
}