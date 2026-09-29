namespace WitcherKM.Planner.Api.Models.Feature;

public class UpdateFeatureRequest
{
    public required string Name { get; init; }
    public string? Description { get; init; }
    public long FeatureId { get; init; }
}