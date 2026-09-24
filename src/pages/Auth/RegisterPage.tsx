import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import RegisterForm from "../../components/Auth/RegisterForm";
import type { RegisterData } from "../../types/auth";
import { RegisterUser } from "../../api/auth";
import { normalizeApiError, getFirstFormError } from "../../utils/error";

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
            toast.success(
                "Registration successful. Please check your email for the OTP code.",
            );
            navigate("/verify-otp", {
                state: {
                    email: formData.email,
                },
            });
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
