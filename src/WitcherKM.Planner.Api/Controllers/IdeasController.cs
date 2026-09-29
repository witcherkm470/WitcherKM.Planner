using MediatR;
using Microsoft.AspNetCore.Mvc;
using WitcherKM.Planner.Api.Models.Idea;
using WitcherKM.Planner.Application.Common.Models.Ideas;
using WitcherKM.Planner.Application.Ideas.Commands;
using WitcherKM.Planner.Application.Ideas.Queries;

namespace WitcherKM.Planner.Api.Controllers;

[ApiController]
[Route("api/ideas")]
public class IdeasController(IMediator mediator) : ControllerBase
{
    [HttpGet("get-ideas", Name = "GetIdeas")]
    public async Task<IEnumerable<IdeaModel>> GetIdeas([FromQuery] bool showCanceled = false)
    {
        return await mediator.Send(new GetIdeas.Query(showCanceled));
    }

    [HttpPost("add-idea", Name = "AddIdea")]
    public async Task<IdeaModel> AddIdea([FromBody] AddIdeaRequest request)
    {
        return await mediator.Send(new AddIdea.Command(request.Essence));
    }

    [HttpPut("update-idea", Name = "UpdateIdea")]
    public async Task<IdeaModel> UpdateIdea([FromBody] UpdateIdeaRequest request)
    {
        return await mediator.Send(new UpdateIdea.Command(request.IdeaId, request.Essence));
    }

    [HttpPut("change-idea-status", Name = "ChangeIdeaStatus")]
    public async Task<IdeaModel> ChangeIdeaStatus([FromBody] ChangeIdeaStatusRequest request)
    {
        return await mediator.Send(new ChangeIdeaStatus.Command(request.IdeaId, request.IdeaStatus));
    }

    [HttpDelete("remove-idea", Name = "RemoveIdea")]
    public async Task<IActionResult> RemoveIdea([FromQuery] long ideaId)
    {
        await mediator.Send(new RemoveIdea.Command(ideaId));
        return NoContent();
    }
}
