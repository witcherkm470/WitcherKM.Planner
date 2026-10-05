export const ProjectStatus = {
    Undefined: 0,
    Opened: 1,
    Closed: 2,
} as const;

export type ProjectStatus =
    typeof ProjectStatus[keyof typeof ProjectStatus];
