using MediatR;
using WitcherKM.Planner.Application.Common.Models;
using WitcherKM.Planner.Application.Common.Models.Ideas;
using WitcherKM.Planner.Domain.Enums;
using WitcherKM.Planner.Infrastructure.Repositories;

namespace WitcherKM.Planner.Application.Ideas.Queries;

public class GetIdeas
{
    public record Query(bool ShowCanceled) : IRequest<IEnumerable<IdeaModel>>;

    public class Handler(IIdeaRepository ideaRepository) : IRequestHandler<Query, IEnumerable<IdeaModel>>
    {
        public async Task<IEnumerable<IdeaModel>> Handle(Query request, CancellationToken cancellationToken)
        {
            var ideas = await ideaRepository.GetAllAsync(cancellationToken);

            return ideas
                .Where(idea => request.ShowCanceled
                    ? idea.IdeaStatus == IdeaStatus.Canceled
                    : idea.IdeaStatus != IdeaStatus.Canceled)
                .Select(idea => idea.ToIdeaModel());
        }
    }
}
