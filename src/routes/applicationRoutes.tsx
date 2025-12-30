import { Route } from "react-router-dom";
import { ROUTES } from "@/utils";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { ApplicationsPage, ApplicationDetailsPage } from "@/pages/applications";

export const applicationRoutes = [
    <Route
        key="job-post-applications"
        path={ROUTES.JOB_POST_APPLICATIONS}
        element={
            <ProtectedRoute>
                <ApplicationsPage />
            </ProtectedRoute>
        }
    />,
    <Route
        key="application-details"
        path={ROUTES.APPLICATION_DETAILS}
        element={
            <ProtectedRoute>
                <ApplicationDetailsPage />
            </ProtectedRoute>
        }
    />,
];
