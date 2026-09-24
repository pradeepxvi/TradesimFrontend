import axios from "axios";

export type AppError = {
    message: string;
    fieldErrors?: Record<string, string[]>;
    retryable?: boolean;
    status?: number;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const extractFieldErrors = (
    data: unknown,
): Record<string, string[]> | undefined => {
    if (!isPlainObject(data)) return undefined;

    const fieldErrors: Record<string, string[]> = {};

    for (const [key, value] of Object.entries(data)) {
        if (["detail", "message", "error", "non_field_errors"].includes(key)) {
            continue;
        }

        if (Array.isArray(value)) {
            const strings = value.filter(
                (entry): entry is string => typeof entry === "string",
            );
            if (strings.length > 0) {
                fieldErrors[key] = strings;
            }
        } else if (typeof value === "string") {
            fieldErrors[key] = [value];
        }
    }

    return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
};

const getUserFacingMessage = (
    status: number | undefined,
    detail: string | undefined,
): string => {
    if (detail && detail.length < 200) {
        const lower = detail.toLowerCase();
        if (
            lower.includes("network") ||
            lower.includes("failed to fetch") ||
            lower.includes("timeout") ||
            lower.includes("timed out") ||
            lower.includes("could not connect") ||
            lower.includes("not reachable")
        ) {
            return "We couldn't reach TradeSim right now. Please check your internet connection and try again.";
        }
    }

    if (status === 400) {
        return "We couldn't process your request. Please check the information you entered and try again.";
    }

    if (status === 401) {
        return "Your session has expired. Please sign in again to continue.";
    }

    if (status === 403) {
        return "You don't have permission to perform this action.";
    }

    if (status === 404) {
        return "We couldn't find what you're looking for.";
    }

    if (status === 408) {
        return "The request took too long. Please try again.";
    }

    if (status === 429) {
        return "Too many requests. Please wait a moment and try again.";
    }

    if (status === 500) {
        return "Something went wrong. Please try again in a moment.";
    }

    if (status === 502 || status === 503 || status === 504) {
        return "TradeSim is temporarily unavailable. Please try again shortly.";
    }

    if (detail) {
        return detail;
    }

    return "Something went wrong. Please try again.";
};

export const normalizeApiError = (error: unknown): AppError => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;
        const detail =
            typeof data?.detail === "string"
                ? data.detail
                : typeof data?.message === "string"
                  ? data.message
                  : undefined;

        const fieldErrors = extractFieldErrors(data);
        const message = getUserFacingMessage(status, detail);

        return {
            message,
            fieldErrors,
            retryable:
                !error.response ||
                status === 408 ||
                status === 429 ||
                status === 500 ||
                status === 502 ||
                status === 503 ||
                status === 504 ||
                status === 0,
            status,
        };
    }

    if (error instanceof Error && error.message) {
        const message =
            error.message.toLowerCase().includes("network") ||
            error.message.toLowerCase().includes("timeout") ||
            error.message.toLowerCase().includes("failed to fetch")
                ? "We couldn't reach TradeSim right now. Please check your internet connection and try again."
                : "Something went wrong. Please try again.";

        return {
            message,
            retryable: true,
        };
    }

    return {
        message: "Something went wrong. Please try again.",
        retryable: true,
    };
};

export const getFieldError = (
    fieldErrors: Record<string, string[]> | undefined,
    field: string,
): string | undefined => fieldErrors?.[field]?.[0];

export const getFirstFormError = (
    fieldErrors: Record<string, string[]> | undefined,
): string | undefined => {
    if (!fieldErrors) return undefined;

    for (const value of Object.values(fieldErrors)) {
        if (value?.[0]) {
            return value[0];
        }
    }

    return undefined;
};

export const getFriendlyErrorMessage = (error: unknown): string =>
    normalizeApiError(error).message;
