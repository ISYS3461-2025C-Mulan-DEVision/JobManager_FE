import { Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import ProfilePage from "@/pages/profile/ProfilePage";
import { ROUTES } from "@/utils";

export const mainRoutes = [
    <Route key="home" path={ROUTES.HOME} element={<Landing />} />,
    <Route key="dashboard" path={ROUTES.DASHBOARD} element={<Dashboard />} />,
    <Route key="profile" path={ROUTES.PROFILE} element={<ProfilePage />} />,
];
