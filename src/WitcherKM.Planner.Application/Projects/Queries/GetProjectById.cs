using MediatR;
using WitcherKM.Planner.Application.Common.Models;
using WitcherKM.Planner.Application.Common.Models.Projects;
using WitcherKM.Planner.Domain.Entities;
using WitcherKM.Planner.Infrastructure.Repositories;
using WitcherKM.Common.Core.Exceptions;

namespace WitcherKM.Planner.Application.Projects.Queries;

public class GetProjectById
{
    public record Query(long ProjectId) : IRequest<ProjectExtendedModel>;

    public class Handler : IRequestHandler<Query, ProjectExtendedModel>
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IFeatureRepository _featureRepository;

        public Handler(IProjectRepository projectRepository, IFeatureRepository featureRepository)
        {
            _projectRepository = projectRepository;
            _featureRepository = featureRepository;
        }

        public async Task<ProjectExtendedModel> Handle(Query request, CancellationToken cancellationToken)
        {
            var project = await _projectRepository.GetByIdAsync(request.ProjectId, cancellationToken);

            if(project is null)
                throw new EntityNotFoundException(request.ProjectId, $"Entity {nameof(Project)} with id {request.ProjectId} does not exist");
            
            var openedFeaturesCount = await _featureRepository.GetOpenedFeaturesCountByProjectIdAsync(request.ProjectId, cancellationToken);

            return project.ToProjectExtendedModel(openedFeaturesCount);
        }
    }
}