import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ResendOTP } from "../../api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ResendOTPForm from "../../components/Auth/ResendOTPForm";
import { normalizeApiError } from "../../utils/error";

const ResendOTPPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const mutation = useMutation({
        mutationFn: ResendOTP,
        onSuccess: () => {
            toast.success("A new OTP has been sent to your email.");
            navigate("/verify-otp", { state: { email } });
        },
        onError: (error: unknown) => {
            const appError = normalizeApiError(error);
            toast.error(appError.message);
        },
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setEmail(value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutation.mutate(email);
    };

    return (
        <ResendOTPForm
            email={email}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isLoading={mutation.isPending}
        />
    );
};

export default ResendOTPPage;
