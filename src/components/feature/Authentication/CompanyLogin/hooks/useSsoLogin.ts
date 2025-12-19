import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { storeAuthSession } from "../../../../../services/authStorage";

interface SsoLoginResult {
    success: boolean;
    error: string | null;
}

interface UseSsoLoginReturn {
    ssoLoginResult: SsoLoginResult | null;
    isProcessingSso: boolean;
    clearSsoResult: () => void;
}

export const useSsoLogin = (): UseSsoLoginReturn => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [isProcessingSso, setIsProcessingSso] = useState(false);
    const [ssoLoginResult, setSsoLoginResult] = useState<SsoLoginResult | null>(
        null
    );
    const [hasProcessed, setHasProcessed] = useState(false);

    useEffect(() => {
        // Prevent processing twice
        if (hasProcessed) return;

        const sso = searchParams.get("sso");
        const success = searchParams.get("success");
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");
        const companyId = searchParams.get("companyId");
        const email = searchParams.get("email");
        const role = searchParams.get("role");
        const authProvider = searchParams.get("authProvider");
        const error = searchParams.get("error");

        if (sso === "google") {
            console.log("SSO Login Parameters:", {
                sso,
                success,
                hasAccessToken: !!accessToken,
                hasRefreshToken: !!refreshToken,
                companyId,
                email,
                role,
                authProvider,
                error,
                fullURL: window.location.href,
            });
            setIsProcessingSso(true);

            if (
                success === "true" &&
                accessToken &&
                refreshToken &&
                companyId &&
                email &&
                role &&
                authProvider
            ) {
                console.log("Storing auth session and navigating to dashboard");
                // Successful SSO login - store tokens with user data
                storeAuthSession({
                    accessToken,
                    refreshToken,
                    tokenType: "Bearer",
                    expiresIn: 86400, // 24 hours
                    companyId,
                    email: decodeURIComponent(email),
                    role,
                    authProvider,
                });

                setSsoLoginResult({ success: true, error: null });
                setHasProcessed(true);
                setIsProcessingSso(false);

                // Navigate directly without clearing params first
                navigate("/dashboard", { replace: true });
            } else if (success === "false" && error) {
                console.log("SSO login failed:", error);
                // Failed SSO login
                setSsoLoginResult({
                    success: false,
                    error: decodeURIComponent(error),
                });

                setHasProcessed(true);
                setIsProcessingSso(false);
                
                // Clear URL params but stay on login page
                const newParams = new URLSearchParams();
                setSearchParams(newParams, { replace: true });
            } else if (sso === "google") {
                // If we have sso=google but missing required params, stop processing
                console.log("SSO parameters incomplete");
                setIsProcessingSso(false);
            }
        }
    }, [searchParams, setSearchParams, navigate, hasProcessed]);

    const clearSsoResult = useCallback(() => {
        setSsoLoginResult(null);
    }, []);

    return {
        ssoLoginResult,
        isProcessingSso,
        clearSsoResult,
    };
};

export default useSsoLogin;
