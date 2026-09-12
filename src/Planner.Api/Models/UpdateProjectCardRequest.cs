namespace Planner.Api.Models;

public class UpdateProjectCardRequest : UpdateProjectRequest
{
    public string? Documentation { get; init; }
}