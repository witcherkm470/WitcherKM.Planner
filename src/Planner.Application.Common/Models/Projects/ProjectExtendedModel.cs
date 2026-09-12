namespace Planner.Application.Common.Models.Projects;

public class ProjectExtendedModel : ProjectModel
{
    public string? Documentation { get; init; }
    public int OpenedFeatureCount { get; init; }
}