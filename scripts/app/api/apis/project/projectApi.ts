import type {ProjectModel} from "../../models/project/ProjectModel.ts";
import {apiClient} from "../../apiClient.ts";
import type {UpdateProjectRequest} from "../../models/project/requests/UpdateProjectRequest.ts";
import type {AddProjectRequest} from "../../models/project/requests/AddProjectRequest.ts";
import type {ProjectExtendedModel} from "../../models/project/ProjectExtendedModel.ts";
import type {UpdateProjectCardRequest} from "../../models/project/requests/UpdateProjectCardRequest.ts";

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

export async function updateProject(request: UpdateProjectRequest): Promise<ProjectModel> {
    const response = await apiClient.put<ProjectModel>(
        "/projects/update-project",
        request
    );

    return response.data;
}

export async function addProject(request: AddProjectRequest): Promise<ProjectModel> {
    const response = await apiClient.post<ProjectModel>(
        "/projects/add-project",
        request
    );

    return response.data;
}

export async function getProjectById(projectId: number): Promise<ProjectExtendedModel> {
    const response = await apiClient.get<ProjectExtendedModel>(
        `/projects/get-project-by-id?ProjectId=${projectId}`
    );

    return response.data;
}

export async function updateProjectCard(request: UpdateProjectCardRequest): Promise<ProjectExtendedModel> {
    const response = await apiClient.put<ProjectExtendedModel>(
        "/projects/update-project-card",
        request
    );

    return response.data;
}
