import type {ProjectModel} from "./ProjectModel.ts";

export interface ProjectExtendedModel extends ProjectModel {
    documentation: string | null;
    openedFeatureCount: number;
}
