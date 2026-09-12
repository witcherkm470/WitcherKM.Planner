export const FeatureStatus = {
    Undefined: 0,
    Opened: 1,
    InProgress: 2,
    Completed: 3,
} as const;

export type FeatureStatus =
    typeof FeatureStatus[keyof typeof FeatureStatus];
