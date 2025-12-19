import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService, {
    LoginPayload,
} from "@/components/feature/Authentication/api/AuthService";
import { storeAuthSession } from "@/services/authStorage";
import { ROUTES } from "@/utils";

export const useCompanyLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const clearError = () => setError(null);

    const login = async (formData: LoginPayload) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log("Attempting login for:", formData.email);
            const response = await AuthService.loginCompany(formData);

            if (!response.success || !response.data) {
                throw new Error(
                    response.message ||
                        "Failed to login. Please check your credentials."
                );
            }

            console.log("Login successful, storing auth session");
            storeAuthSession(response.data);

            console.log("Navigating to dashboard");
            navigate(ROUTES.DASHBOARD, { replace: true });
            return response.data;
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to login. Please check your credentials.";
            setError(message);
            console.error("Login error:", err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        login,
        isLoading,
        error,
        clearError,
    };
};
