export const IdeaStatus = {
    Undefined: 0,
    Realized: 1,
    NotRealized: 2,
    Canceled: 3,
} as const;

export type IdeaStatus =
    typeof IdeaStatus[keyof typeof IdeaStatus];
