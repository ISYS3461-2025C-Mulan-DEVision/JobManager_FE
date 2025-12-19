import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { storeAuthSession } from '../../../../../services/authStorage';

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
    const [ssoLoginResult, setSsoLoginResult] = useState<SsoLoginResult | null>(null);

    useEffect(() => {
        const sso = searchParams.get('sso');
        const success = searchParams.get('success');
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const error = searchParams.get('error');

        if (sso === 'google') {
            setIsProcessingSso(true);

            if (success === 'true' && accessToken && refreshToken) {
                // Successful SSO login - store tokens
                storeAuthSession({
                    accessToken,
                    refreshToken,
                    tokenType: 'Bearer',
                    expiresIn: 86400, // 24 hours
                    companyId: '', // Will be extracted from token if needed
                    email: '',
                    role: '',
                    authProvider: 'GOOGLE',
                });

                setSsoLoginResult({ success: true, error: null });

                // Clear URL params
                const newParams = new URLSearchParams();
                setSearchParams(newParams, { replace: true });

                // Navigate to dashboard
                navigate('/dashboard');
            } else if (success === 'false' && error) {
                // Failed SSO login
                setSsoLoginResult({
                    success: false,
                    error: decodeURIComponent(error)
                });

                // Clear URL params but stay on login page
                const newParams = new URLSearchParams();
                setSearchParams(newParams, { replace: true });
            }

            setIsProcessingSso(false);
        }
    }, [searchParams, setSearchParams, navigate]);

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