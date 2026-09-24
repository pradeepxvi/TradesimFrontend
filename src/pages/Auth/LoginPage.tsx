import React, { useState, type FormEvent } from "react";

import type { LoginData, LoginResponse } from "../../types/auth";

import { useMutation } from "@tanstack/react-query";

import { LoginUser } from "../../api/auth";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import LoginForm from "../../components/Auth/LoginForm";

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

            localStorage.setItem("user", JSON.stringify(data));

            navigate("/dashboard");
        },

        onError: (error: unknown) => {
            if (axios.isAxiosError(error)) {
                const data = error.response?.data;

                console.log("Login error:", error.response);

                setErrors(
                    data ?? {
                        form: ["Something went wrong."],
                    },
                );
            } else {
                setErrors({
                    form: ["Something went wrong."],
                });
            }
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
