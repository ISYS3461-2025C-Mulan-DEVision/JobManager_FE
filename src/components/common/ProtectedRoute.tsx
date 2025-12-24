import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Component to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <>{children}</>;
};
