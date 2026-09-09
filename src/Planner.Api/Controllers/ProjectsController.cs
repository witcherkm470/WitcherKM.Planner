using MediatR;
using Microsoft.AspNetCore.Mvc;
using Planner.Api.Models;
using Planner.Application.Common.Models.Projects;
using Planner.Application.Projects.Commands;
using Planner.Application.Projects.Query;

namespace Planner.Api.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectsController(IMediator mediator) : ControllerBase
{
    [HttpGet("get-projects", Name = "GetProjects")]
    public async Task<IEnumerable<ProjectModel>> GetProjects()
    {
        return await mediator.Send(new GetProjects.Query());
    }

    [HttpPost("add-project", Name = "AddProject")]
    public async Task<ProjectModel> AddProject([FromBody] AddProjectRequest request)
    {
        return await mediator.Send(new AddProject.Command(request.Name, request.Description, request.Documentation));
    }
    
    [HttpDelete("remove-project", Name = "RemoveProject")]
    public async Task<IActionResult> RemoveProject([FromQuery] RemoveProjectRequest request)
    {
        await mediator.Send(new RemoveProject.Command(request.ProjectId));
        return NoContent();
    }
}