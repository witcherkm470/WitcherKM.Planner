using MediatR;
using Planner.Application.Common.Models;
using Planner.Application.Common.Models.Feature;
using Planner.Domain.Entities;
using Planner.Infrastructure.Repositories;
using WitcherKM.Common.Core.Exceptions;
using WitcherKM.Common.Orm.Abstractions;

namespace Planner.Application.Features.Commands;

public class AddFeature
{
    public record Command(string Name, string? Description, long ProjectId) : IRequest<FeatureModel>;
    
    public class Handler : IRequestHandler<Command, FeatureModel>
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

        public async Task<FeatureModel> Handle(Command request, CancellationToken cancellationToken)
        {
            using var unitOfWork = _unitOfWorkManager.Create();
            
            var project = await _projectRepository.GetByIdAsync(request.ProjectId, cancellationToken);
            
            if(project == null)
                throw new EntityNotFoundException(request.ProjectId, $"Entity {nameof(Project)} with id {request.ProjectId} does not exist");
            
            var feature = new Feature(request.Name, request.Description, project.Id);
            await _featureRepository.AddAsync(feature, cancellationToken);
            await unitOfWork.CommitAsync(cancellationToken);  
            
            return feature.ToFeatureModel(project.Name);
        }
    }
}