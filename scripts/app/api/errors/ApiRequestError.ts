export interface ApiRequestError {
    status?: number;
    type?: string;
    message: string;
    messages: string[];
}
