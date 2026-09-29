using WitcherKM.Planner.Domain.Enums;

namespace WitcherKM.Planner.Application.Common.Models.Ideas;

public class IdeaModel
{
    public long Id { get; init; }
    public required string Essence { get; init; }
    public IdeaStatus IdeaStatus { get; init; }
}
