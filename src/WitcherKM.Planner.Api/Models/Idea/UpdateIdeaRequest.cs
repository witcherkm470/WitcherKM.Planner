namespace WitcherKM.Planner.Api.Models.Idea;

public class UpdateIdeaRequest
{
    public long IdeaId { get; init; }
    public required string Essence { get; init; }
}
