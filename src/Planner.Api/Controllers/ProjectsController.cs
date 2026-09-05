using MediatR;
using Microsoft.AspNetCore.Mvc;
using Planner.Api.Models;
using Planner.Application.Common.Models.Projects;
using Planner.Application.Projects.Commands;
using Planner.Application.Projects.Query;

namespace Planner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController(IMediator mediator) : ControllerBase
{
    [HttpGet("get-projects", Name = "GetProjects")]
    public async Task<IEnumerable<ProjectModel>> GetProjects()
    {
        return await mediator.Send(new GetProjects.Query());
    }

    [HttpPost("add-projects", Name = "AddProject")]
    public async Task<ProjectModel> AddProject([FromBody] AddProjectRequest request)
    {
        return await mediator.Send(new AddProject.Query(request.Name, request.Documentation));
    }
}