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
            const strings = value
                .map((entry) =>
                    typeof entry === "string" ? entry : String(entry),
                )
                .filter((entry) => entry.trim().length > 0);

            if (strings.length > 0) {
                fieldErrors[key] = strings;
            }
        } else if (typeof value === "string") {
            fieldErrors[key] = [value];
        }
    }

    return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
};

const extractDetailMessage = (data: unknown): string | undefined => {
    if (!isPlainObject(data)) return undefined;

    if (typeof data.detail === "string") return data.detail;
    if (typeof data.message === "string") return data.message;

    if (
        Array.isArray(data.non_field_errors) &&
        typeof data.non_field_errors[0] === "string"
    ) {
        return data.non_field_errors[0];
    }
    if (typeof data.non_field_errors === "string") {
        return data.non_field_errors;
    }

    return undefined;
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
        return (
            detail ||
            "We couldn't process your request. Please check the information you entered and try again."
        );
    }

    if (status === 401) {
        return "Your session has expired. Please Login again to continue.";
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
        const detail = extractDetailMessage(data);

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
        const lower = error.message.toLowerCase();
        const isNetwork =
            lower.includes("network") ||
            lower.includes("timeout") ||
            lower.includes("failed to fetch");

        return {
            message: isNetwork
                ? "We couldn't reach TradeSim right now. Please check your internet connection and try again."
                : "Something went wrong. Please try again.",
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
