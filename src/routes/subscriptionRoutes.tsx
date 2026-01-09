import { Route } from "react-router-dom";
import SubscriptionManagementPage from "@/pages/subscription/SubscriptionManagementPage";
import { ROUTES } from "@/utils";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

export const subscriptionRoutes = [
    <Route
        key="subscription"
        path={ROUTES.SUBSCRIPTION}
        element={
            <ProtectedRoute>
                <SubscriptionManagementPage />
            </ProtectedRoute>
        }
    />,
];
