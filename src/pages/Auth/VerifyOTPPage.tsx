import { useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import VerifyOTPForm from "../../components/Auth/VerifyOTPForm";
import type { VerifyOTPData } from "../../types/auth";
import { VerifyOTP } from "../../api/auth";

const VerifyOTPPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const emailFromRegister = location.state?.email || "";

    const [formData, setFormData] = useState<VerifyOTPData>({
        email: emailFromRegister,
        otp: "",
    });

    const [errors, setErrors] = useState("");

    const mutation = useMutation({
        mutationFn: VerifyOTP,

        onSuccess: () => {
            setErrors("");
            navigate("/login");
        },

        onError: (error: unknown) => {
            if (axios.isAxiosError(error)) {
                const data = error.response?.data;

                console.log("Verify email error:", error.response);
                setErrors(data?.detail);
                console.log(data?.detail);
            } else {
                setErrors("Something went wrong.");
            }
        },
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors("");
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.email || !formData.otp) {
            setErrors("Email and verification code are required.");
            return;
        }

        mutation.mutate(formData);
    };

    return (
        <VerifyOTPForm
            formData={formData}
            errors={errors}
            isLoading={mutation.isPending}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
        />
    );
};

export default VerifyOTPPage;
