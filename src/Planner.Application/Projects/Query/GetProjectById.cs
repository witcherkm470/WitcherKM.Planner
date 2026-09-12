using MediatR;
using Planner.Application.Common.Models;
using Planner.Application.Common.Models.Projects;
using Planner.Domain.Entities;
using Planner.Infrastructure.Repositories;
using WitcherKM.Common.Core.Exceptions;

namespace Planner.Application.Projects.Query;

public class GetProjectById
{
    public record Query(long ProjectId) : IRequest<ProjectExtendedModel>;

    public class Handler(IProjectRepository projectRepository) : IRequestHandler<Query, ProjectExtendedModel>
    {
        public async Task<ProjectExtendedModel> Handle(Query request, CancellationToken cancellationToken)
        {
            var project = await projectRepository.GetByIdAsync(request.ProjectId, cancellationToken);

            if(project is null)
                throw new EntityNotFoundException(request.ProjectId, $"Entity {nameof(Project)} with id {request.ProjectId} does not exist");

            return project.ToProjectExtendedModel();
        }
    }
}