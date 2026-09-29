import type { IdeaStatus } from "./IdeaStatus.ts";
import { IdeaStatus as Status } from "./IdeaStatus.ts";

export interface IdeaModel {
    id: number;
    essence: string;
    ideaStatus: IdeaStatus;
}

export const IdeaStatusLabel: Record<IdeaStatus, string> = {
    [Status.Undefined]: "Не определён",
    [Status.Realized]: "Реализована",
    [Status.NotRealized]: "Не реализована",
    [Status.Canceled]: "Отклонена",
};
