import { apiClient } from "../../apiClient.ts";
import type { IdeaModel } from "../../models/idea/IdeaModel.ts";
import type { AddIdeaRequest } from "../../models/idea/requests/AddIdeaRequest.ts";
import type { UpdateIdeaRequest } from "../../models/idea/requests/UpdateIdeaRequest.ts";
import type { ChangeIdeaStatusRequest } from "../../models/idea/requests/ChangeIdeaStatusRequest.ts";

export async function getIdeas(showCanceled: boolean): Promise<IdeaModel[]> {
    const response = await apiClient.get<IdeaModel[]>("/ideas/get-ideas", {
        params: { showCanceled }
    });

    return response.data;
}

export async function addIdea(request: AddIdeaRequest): Promise<IdeaModel> {
    const response = await apiClient.post<IdeaModel>("/ideas/add-idea", request);
    return response.data;
}

export async function updateIdea(request: UpdateIdeaRequest): Promise<IdeaModel> {
    const response = await apiClient.put<IdeaModel>("/ideas/update-idea", request);
    return response.data;
}

export async function changeIdeaStatus(request: ChangeIdeaStatusRequest): Promise<IdeaModel> {
    const response = await apiClient.put<IdeaModel>("/ideas/change-idea-status", request);
    return response.data;
}

export async function deleteIdea(ideaId: number): Promise<void> {
    await apiClient.delete("/ideas/remove-idea", { params: { ideaId } });
}
