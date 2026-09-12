using MediatR;
using Microsoft.AspNetCore.Mvc;
using Planner.Api.Models.Feature;
using Planner.Application.Common.Models.Feature;
using Planner.Application.Features.Commands;
using Planner.Application.Features.Queries;

namespace Planner.Api.Controllers;

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