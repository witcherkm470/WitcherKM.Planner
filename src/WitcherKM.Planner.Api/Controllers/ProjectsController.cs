using MediatR;
using Microsoft.AspNetCore.Mvc;
using WitcherKM.Planner.Api.Models;
using WitcherKM.Planner.Api.Models.Project;
using WitcherKM.Planner.Application.Common.Models.Projects;
using WitcherKM.Planner.Application.Projects.Commands;
using WitcherKM.Planner.Application.Projects.Queries;

namespace WitcherKM.Planner.Api.Controllers;

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
        return await mediator.Send(new AddProject.Command(request.Name, request.Description));
    }
    
    [HttpDelete("remove-project", Name = "RemoveProject")]
    public async Task<IActionResult> RemoveProject([FromQuery] RemoveProjectRequest request)
    {
        await mediator.Send(new RemoveProject.Command(request.ProjectId));
        return NoContent();
    }
    
    [HttpPut("update-project", Name = "UpdateProject")]
    public async Task<ProjectModel> UpdateProject([FromBody] UpdateProjectRequest request)
    {
        return await mediator.Send(new UpdateProject.Command(request.ProjectId, request.Name, request.Description));
    }
    
    [HttpGet("get-project-by-id", Name = "GetProjectById")]
    public async Task<ProjectExtendedModel> GetProjectById([FromQuery] long projectId)
    {
        return await mediator.Send(new GetProjectById.Query(projectId));
    }
    
    [HttpPut("update-project-card", Name = "UpdateProjectCard")]
    public async Task<ProjectExtendedModel> UpdateProjectCard([FromBody] UpdateProjectCardRequest request)
    {
        return await mediator.Send(new UpdateProjectCard.Command(request.ProjectId, request.Name, request.Description, request.Documentation));
    }
    
    [HttpGet("get-project-features", Name = "GetProjectFeatures")]
    public async Task<IEnumerable<ProjectFeaturesModel>> GetProjectFeatures([FromQuery] long projectId)
    {
        return await mediator.Send(new GetProjectFeatures.Query(projectId));
    }
    
    [HttpGet("get-project-name-and-ids", Name = "GetProjectNameAndIds")]
    public async Task<IEnumerable<ProjectNameIdModel>> GetProjectNameAndIds()
    {
        return await mediator.Send(new GetProjectNameAndIds.Query());
    }
}