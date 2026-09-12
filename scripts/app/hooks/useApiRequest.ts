import {useCallback, useState} from "react";
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

    const execute = useCallback(
        async (...args: TArgs): Promise<void> => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await request(...args);

                setData(result);

                if (onSuccess) {
                    await onSuccess(result);
                }
            } catch (error) {
                if (axios.isAxiosError<BackendErrorResponse>(error)) {
                    const responseData = error.response?.data;

                    let messages: string[] = [];

                    if (responseData) {
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
                        message: messages[0] ?? "Unexpected error",
                        messages
                    });

                    return;
                }

                setError({
                    message: "Unexpected error",
                    messages: ["Unexpected error"]
                });
            } finally {
                setIsLoading(false);
            }
        },
        [request, onSuccess]
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
