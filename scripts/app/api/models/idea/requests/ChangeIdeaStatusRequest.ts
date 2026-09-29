import type { IdeaStatus } from "../IdeaStatus.ts";

export interface ChangeIdeaStatusRequest {
    ideaId: number;
    ideaStatus: IdeaStatus;
}
