using MediatR;
using Planner.Application.Common.Models;
using Planner.Application.Common.Models.Projects;
using Planner.Domain.Entities;
using Planner.Infrastructure.Repositories;
using WitcherKM.Common.Core.Exceptions;
using WitcherKM.Common.Orm.Abstractions;

namespace Planner.Application.Projects.Commands;

public class UpdateProjectCard
{
    public record Command(long ProjectId, string Name, string? Description, string? Documentation) : IRequest<ProjectExtendedModel>;
    
    public class Handler : IRequestHandler<Command, ProjectExtendedModel>
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IProjectRepository _projectRepository;

        public Handler(IUnitOfWorkManager unitOfWorkManager, IProjectRepository projectRepository)
        {
            _unitOfWorkManager = unitOfWorkManager;
            _projectRepository = projectRepository;
        }

        public async Task<ProjectExtendedModel> Handle(Command request, CancellationToken cancellationToken)
        {
            using var unitOfWork = _unitOfWorkManager.Create();

            var project = await _projectRepository.GetByIdAsync(request.ProjectId, cancellationToken);
            
            if(project == null)
                throw new EntityNotFoundException(request.ProjectId, $"Entity {nameof(Project)} with id {request.ProjectId} does not exist");
            
            project.Update(request.Name, request.Description);
            project.SetDocumentation(request.Documentation);
            await unitOfWork.CommitAsync(cancellationToken);  
            
            return project.ToProjectExtendedModel();
        }
    }
}