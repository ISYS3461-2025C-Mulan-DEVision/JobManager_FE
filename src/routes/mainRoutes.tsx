import { Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import { ROUTES } from "@/utils";

export const mainRoutes = [
    <Route key="home" path={ROUTES.HOME} element={<Landing />} />,
    <Route key="dashboard" path={ROUTES.DASHBOARD} element={<Dashboard />} />,
];
