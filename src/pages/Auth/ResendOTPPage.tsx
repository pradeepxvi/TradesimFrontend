import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ResendOTP } from "../../api/auth";
import { useMutation } from "@tanstack/react-query";
import ResendOTPForm from "../../components/Auth/ResendOTPForm";

const ResendOTPPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const mutation = useMutation({
        mutationFn: ResendOTP,
        onSuccess: () => navigate("/verify-otp", { state: { email } }),
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
