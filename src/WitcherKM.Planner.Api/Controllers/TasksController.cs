using MediatR;
using Microsoft.AspNetCore.Mvc;
using WitcherKM.Planner.Application.Common.Models.Tasks;
using WitcherKM.Planner.Application.Tasks;
using WitcherKM.Planner.Domain.Enums;
using PlannerTaskStatus = WitcherKM.Planner.Domain.Enums.TaskStatus;
namespace WitcherKM.Planner.Api.Controllers;
[ApiController]
[Route("api/tasks")]
public class TasksController(IMediator mediator) : ControllerBase
{
    [HttpGet] public Task<IEnumerable<TaskModel>> Get([FromQuery] long? featureId,[FromQuery] PlannerTaskStatus? taskStatus) => mediator.Send(new TaskOperations.Get(featureId,taskStatus));
    [HttpGet("{taskId:long}")] public Task<TaskModel> GetById(long taskId) => mediator.Send(new TaskOperations.GetById(taskId));
    [HttpPost] public Task<TaskModel> Add([FromBody] TaskOperations.Add request) => mediator.Send(request);
    [HttpPut("{taskId:long}")] public Task<TaskModel> Update(long taskId,[FromBody] TaskOperations.Update request) => mediator.Send(request with { TaskId=taskId });
    [HttpPut("{taskId:long}/status")] public Task<TaskModel> ChangeStatus(long taskId,[FromBody] TaskOperations.ChangeStatus request) => mediator.Send(request with { TaskId=taskId });
    [HttpDelete("{taskId:long}")] public async Task<IActionResult> Remove(long taskId) { await mediator.Send(new TaskOperations.Remove(taskId)); return NoContent(); }
}
