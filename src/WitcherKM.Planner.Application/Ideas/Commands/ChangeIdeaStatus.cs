using MediatR;
using WitcherKM.Common.Core.Exceptions;
using WitcherKM.Common.Orm.Abstractions;
using WitcherKM.Planner.Application.Common.Models;
using WitcherKM.Planner.Application.Common.Models.Ideas;
using WitcherKM.Planner.Domain.Entities;
using WitcherKM.Planner.Domain.Enums;
using WitcherKM.Planner.Infrastructure.Repositories;

namespace WitcherKM.Planner.Application.Ideas.Commands;

public class ChangeIdeaStatus
{
    public record Command(long IdeaId, IdeaStatus IdeaStatus) : IRequest<IdeaModel>;

    public class Handler(IUnitOfWorkManager unitOfWorkManager, IIdeaRepository ideaRepository)
        : IRequestHandler<Command, IdeaModel>
    {
        public async Task<IdeaModel> Handle(Command request, CancellationToken cancellationToken)
        {
            using var unitOfWork = unitOfWorkManager.Create();

            var idea = await ideaRepository.GetByIdAsync(request.IdeaId, cancellationToken);
            if (idea is null)
                throw new EntityNotFoundException(request.IdeaId, $"Entity {nameof(Idea)} with id {request.IdeaId} does not exist");

            switch (request.IdeaStatus)
            {
                case IdeaStatus.NotRealized:
                    idea.SetNotRealized();
                    break;
                case IdeaStatus.Realized:
                    idea.SetRealized();
                    break;
                case IdeaStatus.Canceled:
                    idea.SetCanceled();
                    break;
                default:
                    throw new DomainException("Unsupported idea status");
            }

            await unitOfWork.CommitAsync(cancellationToken);
            return idea.ToIdeaModel();
        }
    }
}
