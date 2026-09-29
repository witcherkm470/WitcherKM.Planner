import type { TaskStatus } from "./TaskStatus.ts";
export interface TaskModel { id:number; name:string; description:string|null; taskStatus:TaskStatus; featureId:number; featureName:string|null; projectId:number|null; projectName:string|null; }
