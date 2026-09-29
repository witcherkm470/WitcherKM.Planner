export interface UpdateFeatureRequest {
    featureId: number;
    name: string;
    description: string | null;
}