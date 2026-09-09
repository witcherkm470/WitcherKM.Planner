import axios from "axios";
import {OfflineError} from "./errors/OfflineError.ts";

export const apiClient = axios.create({
    baseURL: "/api",
});

apiClient.interceptors.response.use(
    response => response,

    async error => {
        if (!axios.isAxiosError(error)) {
            return Promise.reject(error);
        }

        if (!error.response && !navigator.onLine) {
            return Promise.reject(new OfflineError());
        }

        return Promise.reject(error);
    }
);
