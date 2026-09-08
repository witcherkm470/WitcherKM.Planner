using MediatR;
using Planner.Application.Common.Models;
using Planner.Application.Common.Models.Projects;
using Planner.Domain.Entities;
using Planner.Infrastructure.Repositories;
using WitcherKM.Common.Orm.Abstractions;

namespace Planner.Application.Projects.Commands;

public class AddProject
{
    public record Command(string Name, string? Description, string? Documentation) : IRequest<ProjectModel>;
    
    public class Handler : IRequestHandler<Command, ProjectModel>
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IProjectRepository _projectRepository;

        public Handler(IUnitOfWorkManager unitOfWorkManager, IProjectRepository projectRepository)
        {
            _unitOfWorkManager = unitOfWorkManager;
            _projectRepository = projectRepository;
        }

        public async Task<ProjectModel> Handle(Command request, CancellationToken cancellationToken)
        {
            using var unitOfWork = _unitOfWorkManager.Create();

            var project = new Project(request.Name, request.Description, request.Documentation);
            
            await _projectRepository.AddAsync(project, cancellationToken);
            await unitOfWork.CommitAsync(cancellationToken);  
            
            return project.ToProjectModel();
        }
    }
}