import { apiClient } from "../../apiClient.ts";
import type {FeatureModel} from "../../models/feature/FeatureModel.ts";
import type {AddFeatureRequest} from "../../models/feature/requests/AddFeatureRequest.ts";
import type {ProjectNameIdModel} from "../../models/project/ProjectNameIdModel.ts";

export async function getFeatures(): Promise<FeatureModel[]> {
    const response = await apiClient.get<FeatureModel[]>(
        "/features/get-features"
    );

    return response.data;
}

export async function addFeature(
    request: AddFeatureRequest
): Promise<FeatureModel> {
    const response = await apiClient.post<FeatureModel>(
        "/features/add-feature",
        request
    );

    return response.data;
}

export async function getProjectNameAndIds(): Promise<ProjectNameIdModel[]> {

    const response = await apiClient.get<ProjectNameIdModel[]>(
        "/projects/get-project-name-and-ids"
    );

    return response.data;
}
