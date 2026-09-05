using MediatR;
using Planner.Application.Common.Models;
using Planner.Application.Common.Models.Projects;
using Planner.Infrastructure.Repositories;
using WitcherKM.Common.Orm.Abstractions;

namespace Planner.Application.Projects.Query;

public class GetProjects
{
    public record Query : IRequest<IEnumerable<ProjectModel>>;

    public class Handler : IRequestHandler<Query, IEnumerable<ProjectModel>>
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IProjectRepository _projectRepository;

        public Handler(IUnitOfWorkManager unitOfWorkManager, IProjectRepository projectRepository)
        {
            _unitOfWorkManager = unitOfWorkManager;
            _projectRepository = projectRepository;
        }

        public async Task<IEnumerable<ProjectModel>> Handle(Query request, CancellationToken cancellationToken)
        {
            using var unitOfWork = _unitOfWorkManager.Create();
            var projects = (await _projectRepository.GetAllAsync(cancellationToken)).ToList();
            
            return projects.Select(p => p.ToProjectModel());
        }
    }
}