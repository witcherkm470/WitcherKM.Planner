export const TaskStatus = { Undefined: 0, Open: 1, InProgress: 2, Done: 3 } as const;
export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];
