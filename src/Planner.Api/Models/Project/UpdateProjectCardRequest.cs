namespace Planner.Api.Models.Project;

public class UpdateProjectCardRequest : UpdateProjectRequest
{
    public string? Documentation { get; init; }
}