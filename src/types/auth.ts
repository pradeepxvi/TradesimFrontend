// login

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
    user?: {
        id: number;
        full_name: string;
        email: string;
        is_verified: boolean;
    };
}

export interface ChangePasswordData {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

// register
export interface RegisterData {
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface RegisterResponse {
    message: "string";
    user?: {
        id: number;
        email: string;
        full_name: string;
        is_verified: boolean;
    };
}

// verify otp
export type VerifyOTPData = {
    email: string;
    otp: string;
};

export type VerifyOTPResponse = {
    message: string;
};

// password reset request
export interface PasswordResetRequestData {
    email: string;
}

// verify password reset otp
export interface VerifyResetOtpData {
    email: string;
    otp: string;
}

export interface VerifyResetOtpResponse {
    reset_token: string;
}

// reset password
export interface PasswordResetData {
    reset_token: string;
    new_password: string;
    confirm_password: string;
}

export interface MessageResponse {
    message: string;
}
