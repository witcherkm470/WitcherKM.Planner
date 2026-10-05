import {ProjectStatus} from "./ProjectStatus.ts";

export interface ProjectModel {
    id: number;
    name: string;
    description: string | null;
    projectStatus: ProjectStatus
}

export const ProjectStatusLabel: Record<ProjectStatus, string> = {
    [ProjectStatus.Undefined]: "Undefined",
    [ProjectStatus.Opened]: "Открыт",
    [ProjectStatus.Closed]: "Закрыт",
};
