export const ProjectStatus = {
    Undefined: 0,
    InProgress: 1,
    Completed: 2,
} as const;

export type ProjectStatus =
    typeof ProjectStatus[keyof typeof ProjectStatus];
