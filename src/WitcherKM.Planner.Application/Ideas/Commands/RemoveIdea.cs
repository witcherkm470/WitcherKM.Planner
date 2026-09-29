using MediatR;
using WitcherKM.Common.Core.Exceptions;
using WitcherKM.Common.Orm.Abstractions;
using WitcherKM.Planner.Domain.Entities;
using WitcherKM.Planner.Domain.Enums;
using WitcherKM.Planner.Infrastructure.Repositories;

namespace WitcherKM.Planner.Application.Ideas.Commands;

public class RemoveIdea
{
    public record Command(long IdeaId) : IRequest;

    public class Handler(IUnitOfWorkManager unitOfWorkManager, IIdeaRepository ideaRepository) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            using var unitOfWork = unitOfWorkManager.Create();

            var idea = await ideaRepository.GetByIdAsync(request.IdeaId, cancellationToken);
            if (idea is null)
                throw new EntityNotFoundException(request.IdeaId, $"Entity {nameof(Idea)} with id {request.IdeaId} does not exist");

            if (idea.IdeaStatus == IdeaStatus.Realized)
                throw new DomainException("Realized idea cannot be deleted");

            ideaRepository.Remove(idea);
            await unitOfWork.CommitAsync(cancellationToken);
        }
    }
}
