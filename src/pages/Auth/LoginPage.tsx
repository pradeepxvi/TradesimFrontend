import React, { useState, type FormEvent } from "react";

import type { LoginData, LoginResponse } from "../../types/auth";

import { useMutation } from "@tanstack/react-query";

import { LoginUser } from "../../api/auth";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import LoginForm from "../../components/Auth/LoginForm";
import { normalizeApiError, getFirstFormError } from "../../utils/error";
import { saveStoredUser } from "../../utils/session";

const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<LoginData>({
        email: "",
        password: "adminadmin",
    });

    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const mutation = useMutation({
        mutationFn: LoginUser,

        onSuccess: (data: LoginResponse) => {
            setErrors({});

            saveStoredUser(data);
            toast.success("Login successful.");
            navigate("/dashboard");
        },

        onError: (error: unknown) => {
            const appError = normalizeApiError(error);
            const formError = getFirstFormError(appError.fieldErrors);

            setErrors(
                appError.fieldErrors ?? {
                    form: [formError ?? appError.message],
                },
            );
            toast.error(appError.message);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: [],
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setErrors({
                form: ["All fields are required."],
            });

            return;
        }

        mutation.mutate(formData);
    };

    return (
        <LoginForm
            formData={formData}
            errors={errors}
            isLoading={mutation.isPending}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
        />
    );
};

export default LoginPage;
