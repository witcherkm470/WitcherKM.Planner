using MediatR;
using WitcherKM.Planner.Application.Common.Exceptions;
using WitcherKM.Planner.Domain.Entities;
using WitcherKM.Planner.Infrastructure.Repositories;
using WitcherKM.Common.Core.Exceptions;
using WitcherKM.Common.Orm.Abstractions;

namespace WitcherKM.Planner.Application.Projects.Commands;

public class RemoveProject
{
    public record Command(long ProjectId) : IRequest;

    public class Handler : IRequestHandler<Command>
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IProjectRepository _projectRepository;
        private readonly IFeatureRepository _featureRepository;

        public Handler(IUnitOfWorkManager unitOfWorkManager, IProjectRepository projectRepository, IFeatureRepository featureRepository)
        {
            _unitOfWorkManager = unitOfWorkManager;
            _projectRepository = projectRepository;
            _featureRepository = featureRepository;
        }

        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            using var unitOfWork = _unitOfWorkManager.Create();

            var project = await _projectRepository.GetByIdAsync(request.ProjectId, cancellationToken);
            
            if(project is null)
                throw new EntityNotFoundException(request.ProjectId, $"Entity {nameof(Project)} with id {request.ProjectId} does not exist");
            
            var isAnyFeaturesForProject = await _featureRepository.AnyExistsByProjectIdAsync(project.Id, cancellationToken);
            if (isAnyFeaturesForProject)
            {
                throw new DeleteProjectException("Cannot delete project with features");
            }  
            
            _projectRepository.Remove(project);
            await unitOfWork.CommitAsync(cancellationToken);  
        }
    }
}