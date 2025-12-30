import httpClient from "@/services/httpClient";
import { API_ENDPOINTS } from "@/utils/backendAPIs";
import { getCompanyId } from "@/services/authStorage";
import type {
    ApiResponse,
    SubscriptionStatusResponse,
} from "../types";

// Subscription APIs

/**
 * Get the subscription status for the current company
 * Returns subscription details including premium status
 */
export const getSubscriptionStatus = async (): Promise<
    ApiResponse<SubscriptionStatusResponse>
> => {
    const companyId = getCompanyId();
    if (!companyId) {
        // Return a default non-premium response if no company ID
        return {
            success: true,
            message: "No company ID found",
            data: {
                companyId: "",
                status: "INACTIVE",
                endAt: null,
                isPremium: false,
            },
        };
    }
    const response = await httpClient.get<ApiResponse<SubscriptionStatusResponse>>(
        API_ENDPOINTS.SUBSCRIPTIONS.STATUS(companyId)
    );
    return response.data;
};

/**
 * Quick check if the current company has premium subscription
 * Returns a boolean indicating premium status
 */
export const checkIsPremium = async (): Promise<ApiResponse<boolean>> => {
    const companyId = getCompanyId();
    if (!companyId) {
        return {
            success: true,
            message: "No company ID found",
            data: false,
        };
    }
    const response = await httpClient.get<ApiResponse<boolean>>(
        API_ENDPOINTS.SUBSCRIPTIONS.IS_PREMIUM(companyId)
    );
    return response.data;
};

// Export as service object
const SubscriptionService = {
    getSubscriptionStatus,
    checkIsPremium,
};

export default SubscriptionService;
