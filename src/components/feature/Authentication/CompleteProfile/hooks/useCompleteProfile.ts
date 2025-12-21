import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CompleteProfilePayload } from "../types";
import CompanyService from "@/services/companyService";
import { getStoredUser } from "@/services/authStorage";

export const useCompleteProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const completeProfile = async (formData: CompleteProfilePayload) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const session = getStoredUser();
            if (!session || !session.companyId) {
                throw new Error("User session not found. Please log in again.");
            }

            const response = await CompanyService.updateCompanyProfile(
                session.companyId,
                formData
            );

            if (!response.success) {
                throw new Error(
                    response.message ||
                        "Failed to update profile. Please try again."
                );
            }

            setSuccess("Profile updated successfully!");

            // Redirect to dashboard after short delay
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);

            return response;
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to update profile. Please try again.";
            setError(message);
            console.error(err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);
    const clearSuccess = () => setSuccess(null);

    return {
        completeProfile,
        isLoading,
        error,
        success,
        clearError,
        clearSuccess,
    };
};
