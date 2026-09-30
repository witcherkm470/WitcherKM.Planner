import { FeatureStatus } from "./FeatureStatus.ts";

export interface FeatureModel {
    id: number;
    name: string;
    description: string | null;
    featureStatus: FeatureStatus;
    projectId: number;
    projectName: string;
}

export const FeatureStatusLabel: Record<FeatureStatus, string> = {
    [FeatureStatus.Undefined]: "Undefined",
    [FeatureStatus.Opened]: "Открыта",
    [FeatureStatus.InProgress]: "В работе",
    [FeatureStatus.Completed]: "Завершена",
};
