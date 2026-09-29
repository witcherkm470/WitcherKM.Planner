namespace WitcherKM.Planner.Api.Models.Project;

public class UpdateProjectRequest
{
    public long ProjectId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
}