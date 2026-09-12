import type {UpdateProjectRequest} from "./UpdateProjectRequest.ts";

export interface UpdateProjectCardRequest extends UpdateProjectRequest {
    documentation: string;
}
