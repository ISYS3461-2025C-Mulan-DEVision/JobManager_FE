import { useState } from "react";
import AuthService, { SignupPayload } from "../../api/AuthService.ts";

export const useCompanySignup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signup = async (formData: SignupPayload) => {
        setIsLoading(true);
        setError(null);

        try {
            await AuthService.signupCompany(formData);
            // Handle success (e.g., redirect, store token)
            console.log("Signup successful");
        } catch (err) {
            setError("Failed to sign up. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signup,
        isLoading,
        error,
    };
};
