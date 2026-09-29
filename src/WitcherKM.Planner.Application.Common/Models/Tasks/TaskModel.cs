using WitcherKM.Planner.Domain.Enums;
using PlannerTaskStatus = WitcherKM.Planner.Domain.Enums.TaskStatus;
namespace WitcherKM.Planner.Application.Common.Models.Tasks;
public class TaskModel { public long Id { get; init; } public required string Name { get; init; } public string? Description { get; init; } public PlannerTaskStatus TaskStatus { get; init; } public long FeatureId { get; init; } public string? FeatureName { get; init; } public long? ProjectId { get; init; } public string? ProjectName { get; init; } }
