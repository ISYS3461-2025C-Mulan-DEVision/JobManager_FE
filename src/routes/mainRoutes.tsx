import { Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import ProfilePage from "@/pages/profile/ProfilePage";
import { ROUTES } from "@/utils";
import { PublicRoute } from "@/components/common/PublicRoute";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

export const mainRoutes = [
    <Route
        key="home"
        path={ROUTES.HOME}
        element={
            <PublicRoute>
                <Landing />
            </PublicRoute>
        }
    />,
    <Route
        key="dashboard"
        path={ROUTES.DASHBOARD}
        element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        }
    />,
    <Route
        key="profile"
        path={ROUTES.PROFILE}
        element={
            <ProtectedRoute>
                <ProfilePage />
            </ProtectedRoute>
        }
    />,
];
