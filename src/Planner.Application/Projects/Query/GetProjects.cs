using MediatR;
using Planner.Application.Common.Models;
using Planner.Application.Common.Models.Projects;
using Planner.Infrastructure.Repositories;

namespace Planner.Application.Projects.Query;

public class GetProjects
{
    public record Query : IRequest<IEnumerable<ProjectModel>>;

    public class Handler(IProjectRepository projectRepository) : IRequestHandler<Query, IEnumerable<ProjectModel>>
    {
        public async Task<IEnumerable<ProjectModel>> Handle(Query request, CancellationToken cancellationToken)
        {
            var projects = (await projectRepository.GetAllAsync(cancellationToken)).ToList();
            
            return projects.Select(p => p.ToProjectModel());
        }
    }
}