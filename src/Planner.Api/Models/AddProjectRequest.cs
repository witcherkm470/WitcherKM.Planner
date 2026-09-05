namespace Planner.Api.Models;

public class AddProjectRequest
{
    public required string Name { get; set; }
    public string? Documentation { get; set; }
}