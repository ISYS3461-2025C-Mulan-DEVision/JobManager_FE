import { useState } from "react";
import AuthService, { ForgotPasswordPayload } from "../../api/AuthService";

export const useCompanyForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const clearError = () => setError(null);
    const clearSuccess = () => setSuccess(null);

    const forgotPassword = async (formData: ForgotPasswordPayload) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await AuthService.forgotPasswordCompany(formData);
            setSuccess("Password reset email sent successfully. Please check your inbox.");
        } catch (err) {
            setError("Failed to send reset email. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        forgotPassword,
        isLoading,
        error,
        success,
        clearError,
        clearSuccess,
    };
};