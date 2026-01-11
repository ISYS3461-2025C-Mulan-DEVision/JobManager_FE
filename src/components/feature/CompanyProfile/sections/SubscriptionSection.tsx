import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button/Button";
import { ExternalLink } from "lucide-react";
import { SubscriptionStatusCard } from "@/components/feature/Subscription/components/SubscriptionStatusCard";
import { SubscriptionHistoryTable } from "@/components/feature/Subscription/components/SubscriptionHistoryTable";
import { Alert } from "@/components/ui/Alert/Alert";
import { ROUTES } from "@/utils";
import {
    useSubscriptionStatus,
    useSubscriptionHistory,
    useCancelSubscription,
} from "@/components/feature/Subscription/hooks/useSubscription";

export const SubscriptionSection: React.FC = () => {
    const navigate = useNavigate();

    // Hooks
    const { subscriptionStatus, isLoading: statusLoading, error: statusError, refetch: refetchStatus } = useSubscriptionStatus();
    const { history, isLoading: historyLoading, error: historyError, refetch: refetchHistory } = useSubscriptionHistory();
    const { cancel, isLoading: cancelLoading, error: cancelError, success: cancelSuccess, clearError: clearCancelError, clearSuccess: clearCancelSuccess } = useCancelSubscription();

    // Handlers
    const handleUpgrade = () => {
        navigate(ROUTES.SUBSCRIPTION);
    };

    const handleRenew = () => {
        navigate(ROUTES.SUBSCRIPTION);
    };

    const handleManageSubscription = () => {
        navigate(ROUTES.SUBSCRIPTION);
    };

    const handleCancelSubscription = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period."
        );

        if (!confirmed) return;

        const result = await cancel();

        if (result) {
            await refetchStatus();
            await refetchHistory();

            setTimeout(() => {
                clearCancelSuccess();
            }, 3000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Payment & Subscription</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your subscription plan and payment methods.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ExternalLink className="w-4 h-4" />}
                    onClick={handleManageSubscription}
                >
                    Manage Subscription
                </Button>
            </div>

            {/* Status Loading */}
            {statusLoading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading subscription status...</p>
                </div>
            )}

            {/* Status Error */}
            {statusError && (
                <Alert type="error">
                    {statusError}
                </Alert>
            )}

            {/* Status Card */}
            {subscriptionStatus && !statusLoading && (
                <SubscriptionStatusCard
                    status={subscriptionStatus}
                    onUpgrade={handleUpgrade}
                    onRenew={handleRenew}
                    onCancel={handleCancelSubscription}
                    isLoading={cancelLoading}
                />
            )}

            {/* Cancel Success Alert */}
            {cancelSuccess && (
                <Alert type="success" onClose={clearCancelSuccess}>
                    {cancelSuccess}
                </Alert>
            )}

            {/* Cancel Error Alert */}
            {cancelError && (
                <Alert type="error" onClose={clearCancelError}>
                    {cancelError}
                </Alert>
            )}

            {/* History Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Payment History</h3>
                <SubscriptionHistoryTable
                    history={history.slice(0, 5)}
                    isLoading={historyLoading}
                />
                {historyError && (
                    <Alert type="error">
                        {historyError}
                    </Alert>
                )}
                {history.length > 5 && (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleManageSubscription}
                        >
                            View All History
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionSection;
