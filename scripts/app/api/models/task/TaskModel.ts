import { TaskStatus } from "./TaskStatus.ts";
export interface TaskModel { id:number; name:string; description:string|null; taskStatus:TaskStatus; featureId:number; featureName:string|null; projectId:number|null; projectName:string|null; }

export const TaskStatusLabel: Record<TaskStatus, string> = { [TaskStatus.Undefined]: "Не определён", [TaskStatus.Open]: "Открыта", [TaskStatus.InProgress]: "В работе", [TaskStatus.Done]: "Готова" };
