import { useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import VerifyOTPForm from "../../components/Auth/VerifyOTPForm";
import type { VerifyOTPData } from "../../types/auth";
import { VerifyOTP } from "../../api/auth";
import { getFieldError, normalizeApiError } from "../../utils/error";

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
            toast.success("Email verified successfully. You can now log in.");
            navigate("/login");
        },

        onError: (error: unknown) => {
            const appError = normalizeApiError(error);
            const fieldError =
                getFieldError(appError.fieldErrors, "otp") ?? appError.message;
            setErrors(fieldError);
            toast.error(appError.message);
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
