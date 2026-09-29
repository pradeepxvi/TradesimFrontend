import api from "../../api/axios";
import type { ProfileResponse, ProfileUpdateData } from "./types";

export const UpdateProfile = async (
    data: ProfileUpdateData,
): Promise<ProfileResponse> => {
    const formData = new FormData();

    if (data.email !== undefined) {
        formData.append("email", data.email);
    }

    if (data.full_name !== undefined) {
        formData.append("full_name", data.full_name);
    }

    if (data.profile_picture) {
        formData.append("profile_picture", data.profile_picture);
    }

    const response = await api.patch<ProfileResponse>("/profile/", formData);

    return response.data;
};

export const getProfile = async (): Promise<ProfileResponse> => {
    const response = await api.get("/profile");
    return response.data;
};
