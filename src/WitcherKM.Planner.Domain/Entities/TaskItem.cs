using WitcherKM.Common.Core.Exceptions;
using WitcherKM.Common.Domain.Entities.Abstractions;
using WitcherKM.Planner.Domain.Enums;
using PlannerTaskStatus = WitcherKM.Planner.Domain.Enums.TaskStatus;

namespace WitcherKM.Planner.Domain.Entities;

public class TaskItem : IEntity
{
    public long Id { get; private set; }
    public long FeatureId { get; private set; }
    public Feature Feature { get; private set; } = null!;
    public string Name { get; private set { if (string.IsNullOrWhiteSpace(value)) throw new DomainException("Task name cannot be empty"); field = value; } }
    public string? Description { get; private set; }
    public PlannerTaskStatus TaskStatus { get; private set; }
    private TaskItem() { }
    public TaskItem(string name, string? description, long featureId) { Name = name; Description = description; FeatureId = featureId; TaskStatus = PlannerTaskStatus.Open; }
    public void Update(string name, string? description) { if (TaskStatus == PlannerTaskStatus.Done) throw new DomainException("Done task cannot be updated"); Name = name; Description = description; }
    public void SetInProgress() { if (TaskStatus != PlannerTaskStatus.Open) throw new DomainException("Only open task can be started"); TaskStatus = PlannerTaskStatus.InProgress; }
    public void SetDone() { if (TaskStatus != PlannerTaskStatus.InProgress) throw new DomainException("Only in progress task can be completed"); TaskStatus = PlannerTaskStatus.Done; }
    public void SetOpen() { if (TaskStatus != PlannerTaskStatus.InProgress) throw new DomainException("Only in progress task can be reopened"); TaskStatus = PlannerTaskStatus.Open; }
}
