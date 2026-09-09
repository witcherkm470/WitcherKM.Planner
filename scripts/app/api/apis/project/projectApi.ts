import type {ProjectModel} from "../../models/project/ProjectModel.ts";
import {apiClient} from "../../apiClient.ts";

export async function getProjects(): Promise<ProjectModel[]> {
    const response = await apiClient.get<ProjectModel[]>(
        "/projects/get-projects"
    );

    return response.data;
}

export async function deleteProject(projectId: number): Promise<void> {
    await apiClient.delete(
        `/projects/remove-project?ProjectId=${projectId}`
    );
}
