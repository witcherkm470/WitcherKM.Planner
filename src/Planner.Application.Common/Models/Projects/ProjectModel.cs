namespace Planner.Application.Common.Models.Projects;

public class ProjectModel
{
    public long Id { get; init; }
    public string Name { get; init; }
    public int UnclosedFeaturesCount  { get; init; }
}