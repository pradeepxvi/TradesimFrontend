import type {
    LoginData,
    LoginResponse,
    ChangePasswordData,
    MessageResponse,
    PasswordResetData,
    PasswordResetRequestData,
    RegisterData,
    RegisterResponse,
    VerifyOTPData,
    VerifyOTPResponse,
    VerifyResetOtpData,
    VerifyResetOtpResponse,
} from "../types/auth";
import api from "./axios";

// request password reset
export const requestPasswordReset = async (
    data: PasswordResetRequestData,
): Promise<MessageResponse> => {
    const response = await api.post("/auth/password-reset/request/", data);

    return response.data;
};

export const verifyResetOtp = async (
    data: VerifyResetOtpData,
): Promise<VerifyResetOtpResponse> => {
    const response = await api.post("/auth/password-reset/verify-otp/", data);

    return response.data;
};

export const resetPassword = async (
    data: PasswordResetData,
): Promise<MessageResponse> => {
    const response = await api.post("/auth/password-reset/", data);

    return response.data;
};

// login user
export const LoginUser = async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post("/auth/login/", data);
    console.log(response);
    return response.data;
};

// register
export const RegisterUser = async (
    data: RegisterData,
): Promise<RegisterResponse> => {
    const response = await api.post("/auth/register/", data);
    console.log(response);
    return response.data;
};

// verify register email
export const VerifyOTP = async (
    data: VerifyOTPData,
): Promise<VerifyOTPResponse> => {
    const response = await api.post<VerifyOTPResponse>(
        "/auth/verify-otp/",
        data,
    );

    return response.data;
};

// resend otp
export const ResendOTP = async (email: string): Promise<{ otp: string }> => {
    const response = await api.post("/auth/resend-otp/", { email });
    console.log(response);
    return response.data;
};

export const ChangePassword = async (
    data: ChangePasswordData,
): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
        "/auth/change-password/",
        data,
    );
    return response.data;
};
