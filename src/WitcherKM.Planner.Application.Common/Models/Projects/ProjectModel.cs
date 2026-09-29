using WitcherKM.Planner.Domain.Enums;

namespace WitcherKM.Planner.Application.Common.Models.Projects;

public class ProjectModel
{
    public long Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public ProjectStatus ProjectStatus  { get; init; }
}