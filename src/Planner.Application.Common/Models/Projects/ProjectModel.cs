using Planner.Domain.Enums;

namespace Planner.Application.Common.Models.Projects;

public class ProjectModel
{
    public long Id { get; init; }
    public required string Name { get; init; }
    public int UnclosedFeaturesCount  { get; init; }
    public ProjectStatus ProjectStatus  { get; init; }
}