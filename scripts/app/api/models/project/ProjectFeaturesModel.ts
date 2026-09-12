import type { FeatureStatus } from "../feature/FeatureStatus.ts";

export interface ProjectFeaturesModel {
    id: number;
    name: string;
    description: string | null;
    featureStatus: FeatureStatus;
}
