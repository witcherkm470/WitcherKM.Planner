import {ProjectStatus} from "./ProjectStatus.ts";

export interface ProjectModel {
    id: number;
    name: string;
    description: string;
    projectStatus: ProjectStatus
}

export const ProjectStatusLabel: Record<ProjectStatus, string> = {
    [ProjectStatus.Undefined]: "Undefined",
    [ProjectStatus.InProgress]: "В работе",
    [ProjectStatus.Completed]: "Завершён",
};
