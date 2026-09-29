using MediatR;
using Microsoft.AspNetCore.Mvc;
using WitcherKM.Planner.Api.Models.Feature;
using WitcherKM.Planner.Application.Common.Models.Feature;
using WitcherKM.Planner.Application.Features.Commands;
using WitcherKM.Planner.Application.Features.Queries;

namespace WitcherKM.Planner.Api.Controllers;

[ApiController]
[Route("api/features")]
public class FeaturesController(IMediator mediator) : ControllerBase
{
    [HttpGet("get-features", Name = "GetFeatures")]
    public async Task<IEnumerable<FeatureModel>> GetFeatures()
    {
        return await mediator.Send(new GetFeatures.Query());
    }
    
    [HttpPost("add-feature", Name = "AddFeature")]
    public async Task<FeatureModel> AddFeature([FromBody] AddFeatureRequest request)
    {
        return await mediator.Send(new AddFeature.Command(request.Name, request.Description, request.ProjectId));
    }
    
    [HttpDelete("remove-feature", Name = "RemoveFeature")]
    public async Task<IActionResult> RemoveProject([FromQuery] RemoveFeatureRequest request)
    {
        await mediator.Send(new RemoveFeature.Command(request.FeatureId));
        return NoContent();
    }
    
    [HttpPut("update-feature", Name = "UpdateFeature")]
    public async Task<FeatureModel> UpdateProject([FromBody] UpdateFeatureRequest request)
    {
        return await mediator.Send(new UpdateFeature.Command(request.FeatureId, request.Name, request.Description));
    }
}