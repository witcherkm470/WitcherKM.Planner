using WitcherKM.Planner.Domain.Enums;

namespace WitcherKM.Planner.Api.Models.Idea;

public class ChangeIdeaStatusRequest
{
    public long IdeaId { get; init; }
    public IdeaStatus IdeaStatus { get; init; }
}
