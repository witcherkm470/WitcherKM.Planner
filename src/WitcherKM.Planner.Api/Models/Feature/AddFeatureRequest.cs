namespace WitcherKM.Planner.Api.Models.Feature;

public class AddFeatureRequest
{
    public required string Name { get; init; }
    public string? Description { get; init; }
    public long ProjectId { get; init; }
}