using MediatR;
using WitcherKM.Common.Core.Exceptions;
using WitcherKM.Common.Orm.Abstractions;
using WitcherKM.Planner.Application.Common.Models;
using WitcherKM.Planner.Application.Common.Models.Feature;
using WitcherKM.Planner.Domain.Entities;
using WitcherKM.Planner.Domain.Enums;
using WitcherKM.Planner.Infrastructure.Repositories;

namespace WitcherKM.Planner.Application.Features.Commands;

public class ChangeFeatureStatus
{
    public record Command(long FeatureId, FeatureStatus FeatureStatus) : IRequest<FeatureModel>;

    public class Handler(IUnitOfWorkManager unitOfWorkManager, IFeatureRepository featureRepository, IProjectRepository projectRepository)
        : IRequestHandler<Command, FeatureModel>
    {
        public async Task<FeatureModel> Handle(Command request, CancellationToken cancellationToken)
        {
            using var unitOfWork = unitOfWorkManager.Create();
            var feature = await featureRepository.GetByIdAsync(request.FeatureId, cancellationToken)
                ?? throw new EntityNotFoundException(request.FeatureId, $"Entity {nameof(Feature)} with id {request.FeatureId} does not exist");
            var project = await projectRepository.GetByIdAsync(feature.ProjectId, cancellationToken)
                ?? throw new EntityNotFoundException(feature.ProjectId, $"Entity {nameof(Project)} with id {feature.ProjectId} does not exist");

            switch (request.FeatureStatus)
            {
                case FeatureStatus.Opened: feature.SetFeatureOpened(); break;
                case FeatureStatus.InProgress: feature.SetFeatureInProgress(); break;
                case FeatureStatus.Completed: feature.SetFeatureCompleted(); break;
                default: throw new DomainException("Unsupported feature status");
            }

            await unitOfWork.CommitAsync(cancellationToken);
            return feature.ToFeatureModel(project.Name);
        }
    }
}
