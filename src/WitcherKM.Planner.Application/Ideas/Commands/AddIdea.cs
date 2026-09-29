using MediatR;
using WitcherKM.Common.Orm.Abstractions;
using WitcherKM.Planner.Application.Common.Models;
using WitcherKM.Planner.Application.Common.Models.Ideas;
using WitcherKM.Planner.Domain.Entities;
using WitcherKM.Planner.Infrastructure.Repositories;

namespace WitcherKM.Planner.Application.Ideas.Commands;

public class AddIdea
{
    public record Command(string Essence) : IRequest<IdeaModel>;

    public class Handler(IUnitOfWorkManager unitOfWorkManager, IIdeaRepository ideaRepository)
        : IRequestHandler<Command, IdeaModel>
    {
        public async Task<IdeaModel> Handle(Command request, CancellationToken cancellationToken)
        {
            using var unitOfWork = unitOfWorkManager.Create();

            var idea = new Idea(request.Essence);
            await ideaRepository.AddAsync(idea, cancellationToken);
            await unitOfWork.CommitAsync(cancellationToken);

            return idea.ToIdeaModel();
        }
    }
}
