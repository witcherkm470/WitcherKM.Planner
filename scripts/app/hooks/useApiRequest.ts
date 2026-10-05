import {useCallback, useLayoutEffect, useRef, useState} from "react";
import axios from "axios";

import type {ApiErrorResponse} from "../api/errors/ApiErrorResponse";
import type {ValidationErrorResponse} from "../api/errors/ValidationErrorResponse";
import type {ApiRequestError} from "../api/errors/ApiRequestError";

interface UseApiRequestOptions<TResult> {
    onSuccess?: (data: TResult) => void | Promise<void>;
}

type BackendErrorResponse =
    | ApiErrorResponse
    | ValidationErrorResponse;

function isApiErrorResponse(
    response: BackendErrorResponse
): response is ApiErrorResponse {
    return Array.isArray(response.errors);
}

export function useApiRequest<TArgs extends unknown[], TResult>(
    request: (...args: TArgs) => Promise<TResult>,
    options?: UseApiRequestOptions<TResult>
) {
    const [data, setData] = useState<TResult | null>(null);
    const [error, setError] = useState<ApiRequestError | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSuccess = options?.onSuccess;
    const successCallback = useRef(onSuccess);
    const latestRequest = useRef(0);
    useLayoutEffect(() => { successCallback.current = onSuccess; }, [onSuccess]);
    useLayoutEffect(() => () => { latestRequest.current += 1; }, []);

    const execute = useCallback(
        async (...args: TArgs): Promise<void> => {
            const requestId = ++latestRequest.current;
            const isCurrent = () => requestId === latestRequest.current;
            setIsLoading(true);
            setError(null);

            try {
                const result = await request(...args);
                if (!isCurrent()) return;

                setData(result);

                // A filter can change while a write is pending: reload its current value.
                await successCallback.current?.(result);
            } catch (error) {
                if (!isCurrent()) return;
                if (axios.isAxiosError<BackendErrorResponse>(error)) {
                    const responseData = error.response?.data;

                    let messages: string[] = [];

                    if (responseData && typeof responseData === "object" && responseData.errors) {
                        if (isApiErrorResponse(responseData)) {
                            messages = responseData.errors.map(
                                item => item.message
                            );
                        } else {
                            messages = Object
                                .values(responseData.errors)
                                .flat();
                        }
                    }

                    setError({
                        status: error.response?.status,
                        type: responseData?.type,
                        message: messages[0] ?? "Не удалось выполнить запрос. Повторите попытку.",
                        messages
                    });

                    return;
                }

                setError({
                    message: "Не удалось выполнить запрос. Проверьте соединение и повторите попытку.",
                    messages: ["Не удалось выполнить запрос. Проверьте соединение и повторите попытку."]
                });
            } finally {
                if (isCurrent()) setIsLoading(false);
            }
        },
        [request]
    );

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        execute,
        data,
        error,
        isLoading,
        clearError
    };
}
