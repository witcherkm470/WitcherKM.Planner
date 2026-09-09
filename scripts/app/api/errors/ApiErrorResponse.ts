import type {ApiErrorItem} from "./ApiErrorItem.ts";

export interface ApiErrorResponse {
    type: string;
    errors: ApiErrorItem[];
}
