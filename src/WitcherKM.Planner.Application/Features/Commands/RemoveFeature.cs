using MediatR;
using WitcherKM.Common.Core.Exceptions;
using WitcherKM.Common.Orm.Abstractions;
using WitcherKM.Planner.Domain.Entities;
using WitcherKM.Planner.Domain.Enums;
using WitcherKM.Planner.Infrastructure.Repositories;

namespace WitcherKM.Planner.Application.Features.Commands;

public class RemoveFeature
{
    public record Command(long FeatureId) : IRequest;

    public class Handler : IRequestHandler<Command>
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IFeatureRepository _featureRepository;

        public Handler(IUnitOfWorkManager unitOfWorkManager, IFeatureRepository featureRepository)
        {
            _unitOfWorkManager = unitOfWorkManager;
            _featureRepository = featureRepository;
        }

        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            using var unitOfWork = _unitOfWorkManager.Create();

            var feature = await _featureRepository.GetByIdAsync(request.FeatureId, cancellationToken);
            
            if(feature is null)
                throw new EntityNotFoundException(request.FeatureId, $"Entity {nameof(Feature)} with id {request.FeatureId} does not exist");
            
            if (feature.FeatureStatus == FeatureStatus.Completed)
                throw new DomainException("Completed feature cannot be deleted");
            
            _featureRepository.Remove(feature);
            await unitOfWork.CommitAsync(cancellationToken);  
        }
    }
}
