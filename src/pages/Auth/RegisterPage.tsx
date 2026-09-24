import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import RegisterForm from "../../components/Auth/RegisterForm";
import type { RegisterData } from "../../types/auth";
import { RegisterUser } from "../../api/auth";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterData>({
        full_name: "",
        email: "",
        password: "adminadmin",
        password_confirmation: "adminadmin",
    });

    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const mutation = useMutation({
        mutationFn: RegisterUser,

        onSuccess: () => {
            setErrors({});
            navigate("/verify-otp", {
                state: {
                    email: formData.email,
                },
            });
        },

        onError: (error: unknown) => {
            if (axios.isAxiosError(error)) {
                const data = error.response?.data;

                console.log("Register error:", error.response);

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

        if (
            !formData.full_name ||
            !formData.email ||
            !formData.password ||
            !formData.password_confirmation
        ) {
            setErrors({
                form: ["All fields are required."],
            });

            return;
        }

        mutation.mutate(formData);
    };

    return (
        <RegisterForm
            formData={formData}
            errors={errors}
            isLoading={mutation.isPending}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
        />
    );
};

export default RegisterPage;
