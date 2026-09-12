using Planner.Domain.Enums;

namespace Planner.Application.Common.Models.Feature;

public class FeatureModel
{
    public long Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public FeatureStatus FeatureStatus { get; init; }
    public required string ProjectName { get; init; }
}