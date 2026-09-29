export type ProfileUpdateData = {
    email?: string;
    full_name?: string;
    profile_picture?: File;
};

export type ProfileResponse = {
    email: string;
    full_name: string;
    profile_picture: string | null;
    is_verified: boolean;
};
