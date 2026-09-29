import { apiClient } from "../../apiClient.ts";
import type { TaskModel } from "../../models/task/TaskModel.ts";
import type { TaskStatus } from "../../models/task/TaskStatus.ts";
export const getTasks = async (featureId?:number, taskStatus?:TaskStatus) => (await apiClient.get<TaskModel[]>("/tasks",{params:{featureId,taskStatus}})).data;
export const getTask = async (id:number) => (await apiClient.get<TaskModel>(`/tasks/${id}`)).data;
export const addTask = async (x:{name:string;description:string;featureId:number}) => (await apiClient.post<TaskModel>("/tasks",x)).data;
export const updateTask = async (x:{taskId:number;name:string;description:string}) => (await apiClient.put<TaskModel>(`/tasks/${x.taskId}`,x)).data;
export const changeTaskStatus = async (x:{taskId:number;taskStatus:TaskStatus}) => (await apiClient.put<TaskModel>(`/tasks/${x.taskId}/status`,x)).data;
export const deleteTask = async (id:number) => { await apiClient.delete(`/tasks/${id}`); };
