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
}