import {useEffect, useState, useCallback} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {storeAuthSession} from '../../../../../services/authStorage';
import AuthService from '../../api/AuthService';

interface SsoParams {
    isSso: boolean;
    token: string | null;
    email: string | null;
    name: string | null;

}

interface UseSsoCompletionReturn {
    ssoParams: SsoParams;
    showSsoModal: boolean;
    isLoading: boolean;
    error: string | null;
    completeSsoRegistration: (country: string) => Promise<void>;
    closeSsoModal: () => void;
    clearError: () => void;
}

export const useSsoCompletion = (): UseSsoCompletionReturn => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [showSsoModal, setShowSsoModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ssoParams, setSsoParams] = useState<SsoParams>({
        isSso: false,
        token: null,
        email: null,
        name: null,
    });

    // Detect SSO parameters on mount
    useEffect(() => {
        const sso = searchParams.get('sso');
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const success = searchParams.get('success');
        const errorParam = searchParams.get('error');

        // Handle error from backend
        if (sso === 'google' && success === 'false' && errorParam) {
            setError(decodeURIComponent(errorParam));
            clearUrlParams();
            return;
        }

        if (sso === 'google' && token) {
            setSsoParams({
                isSso: true,
                token,
                email: email ? decodeURIComponent(email) : null,
                name: name ? decodeURIComponent(name) : null,
            });
            setShowSsoModal(true);

            window.sessionStorage.removeItem('pending-google-sso');
        }
    }, [searchParams]);

    const clearUrlParams = useCallback(() => {
        const newParams = new URLSearchParams();
        setSearchParams(newParams, {replace: true});

    }, [setSearchParams]);

    const closeSsoModal = useCallback(() => {
        setShowSsoModal(false);
        setSsoParams({
            isSso: false,
            token: null,
            email: null,
            name: null,
        });

        clearUrlParams();
    }, [clearUrlParams]);

    const clearError = useCallback(() => {
        setError(null);

    }, []);

    const completeSsoRegistration = useCallback(async (country: string) => {
        if (!ssoParams.token) {
            setError('Invalid SSO session. Please try again.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await AuthService.completeSsoRegistration({
                token: ssoParams.token,
                country: country.toUpperCase(),
            });

            if (response.success && response.data) {
                storeAuthSession({
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    tokenType: response.data.tokenType,
                    expiresIn: response.data.expiresIn,
                    companyId: response.data.companyId,
                    email: response.data.email,
                    role: response.data.role,
                    authProvider: response.data.authProvider,
                });

                // Close modal and clear URL params
                closeSsoModal();

                navigate('/dashboard');
            } else {
                setError(response.message || 'Registration failed. Please try again.');
            }
        } catch (err: any) {
            console.error('SSO completion error:', err);

            // Handle other error formats
            if (err.response?.data?.message) {
                setError(err.response.data.message);

            } else if (err.message) {
                setError(err.message);
            } else {
                setError('Network error. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [ssoParams.token, closeSsoModal, navigate]);

    return {
        ssoParams,
        showSsoModal,
        isLoading,
        error,
        completeSsoRegistration,
        closeSsoModal,
        clearError,
    };
}

export default useSsoCompletion;