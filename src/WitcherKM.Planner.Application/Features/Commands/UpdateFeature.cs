using MediatR;
using WitcherKM.Common.Core.Exceptions;
using WitcherKM.Common.Orm.Abstractions;
using WitcherKM.Planner.Application.Common.Models;
using WitcherKM.Planner.Application.Common.Models.Feature;
using WitcherKM.Planner.Domain.Entities;
using WitcherKM.Planner.Infrastructure.Repositories;

namespace WitcherKM.Planner.Application.Features.Commands;

public class UpdateFeature
{
    public record Command(long FeatureId, string Name, string? Description) : IRequest<FeatureModel>;
    
    public class Handler : IRequestHandler<Command, FeatureModel>
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IFeatureRepository _featureRepository;
        private readonly IProjectRepository _projectRepository;

        public Handler(IUnitOfWorkManager unitOfWorkManager, IFeatureRepository featureRepository, IProjectRepository projectRepository)
        {
            _unitOfWorkManager = unitOfWorkManager;
            _featureRepository = featureRepository;
            _projectRepository = projectRepository;
        }

        public async Task<FeatureModel> Handle(Command request, CancellationToken cancellationToken)
        {
            using var unitOfWork = _unitOfWorkManager.Create();

            var feature = await _featureRepository.GetByIdAsync(request.FeatureId, cancellationToken);
            
            if(feature == null)
                throw new EntityNotFoundException(request.FeatureId, $"Entity {nameof(Feature)} with id {request.FeatureId} does not exist");
            
            var project = await _projectRepository.GetByIdAsync(feature.ProjectId, cancellationToken);
            
            if(project == null)
                throw new EntityNotFoundException(feature.ProjectId, $"Entity {nameof(Project)} with id {feature.ProjectId} does not exist");
            
            feature.Update(request.Name, request.Description);
            await unitOfWork.CommitAsync(cancellationToken);  
            
            return feature.ToFeatureModel(project.Name);
        }
    }
}