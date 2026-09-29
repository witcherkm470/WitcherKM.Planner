namespace WitcherKM.Planner.Api.Models.Project;

public class AddProjectRequest
{
    public required string Name { get; set; }
    public string? Description { get; set; }
}