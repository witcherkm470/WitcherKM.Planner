using MediatR;
using WitcherKM.Common.Core.Exceptions;
using WitcherKM.Common.Orm.Abstractions;
using WitcherKM.Planner.Application.Common.Models.Tasks;
using WitcherKM.Planner.Domain.Entities;
using WitcherKM.Planner.Domain.Enums;
using PlannerTaskStatus = WitcherKM.Planner.Domain.Enums.TaskStatus;
using WitcherKM.Planner.Infrastructure.Repositories;
namespace WitcherKM.Planner.Application.Tasks;
public static class TaskOperations
{
    public static TaskModel Model(TaskItem x) => new() { Id=x.Id, Name=x.Name, Description=x.Description, TaskStatus=x.TaskStatus, FeatureId=x.FeatureId, FeatureName=x.Feature?.Name, ProjectId=x.Feature?.ProjectId, ProjectName=x.Feature?.Project?.Name };
    public record Add(string Name, string? Description, long FeatureId) : IRequest<TaskModel>;
    public record Update(long TaskId, string Name, string? Description) : IRequest<TaskModel>;
    public record Remove(long TaskId) : IRequest;
    public record ChangeStatus(long TaskId, PlannerTaskStatus TaskStatus) : IRequest<TaskModel>;
    public record Get(long? FeatureId, PlannerTaskStatus? TaskStatus) : IRequest<IEnumerable<TaskModel>>;
    public record GetById(long TaskId) : IRequest<TaskModel>;
    public class Handler(IUnitOfWorkManager uow, ITaskRepository tasks, IFeatureRepository features) : IRequestHandler<Add,TaskModel>, IRequestHandler<Update,TaskModel>, IRequestHandler<Remove>, IRequestHandler<ChangeStatus,TaskModel>, IRequestHandler<Get,IEnumerable<TaskModel>>, IRequestHandler<GetById,TaskModel>
    {
        public async Task<TaskModel> Handle(Add r, CancellationToken c) { using var u=uow.Create(); if(await features.GetByIdAsync(r.FeatureId,c) is null) throw new EntityNotFoundException(r.FeatureId,"Feature does not exist"); var x=new TaskItem(r.Name,r.Description,r.FeatureId); await tasks.AddAsync(x,c); await u.CommitAsync(c); return Model(x); }
        public async Task<TaskModel> Handle(Update r, CancellationToken c) { using var u=uow.Create(); var x=await Find(r.TaskId,c); x.Update(r.Name,r.Description); await u.CommitAsync(c); return Model(x); }
        public async Task Handle(Remove r, CancellationToken c) { using var u=uow.Create(); var x=await Find(r.TaskId,c); if(x.TaskStatus==PlannerTaskStatus.Done) throw new DomainException("Done task cannot be deleted"); tasks.Remove(x); await u.CommitAsync(c); }
        public async Task<TaskModel> Handle(ChangeStatus r, CancellationToken c) { using var u=uow.Create(); var x=await Find(r.TaskId,c); switch(r.TaskStatus) { case PlannerTaskStatus.Open: x.SetOpen(); break; case PlannerTaskStatus.InProgress: x.SetInProgress(); break; case PlannerTaskStatus.Done: x.SetDone(); break; default: throw new DomainException("Unsupported task status"); } await u.CommitAsync(c); return Model(x); }
        public async Task<IEnumerable<TaskModel>> Handle(Get r, CancellationToken c) { var all=await tasks.GetAllWithRelationsAsync(r.FeatureId,c); return all.Where(x => !r.TaskStatus.HasValue || x.TaskStatus==r.TaskStatus).Select(Model); }
        public async Task<TaskModel> Handle(GetById r, CancellationToken c) { var x=await tasks.GetByIdWithRelationsAsync(r.TaskId,c) ?? throw new EntityNotFoundException(r.TaskId,"Task does not exist"); return Model(x); }
        private async Task<TaskItem> Find(long id,CancellationToken c) => await tasks.GetByIdAsync(id,c) ?? throw new EntityNotFoundException(id,"Task does not exist");
    }
}
