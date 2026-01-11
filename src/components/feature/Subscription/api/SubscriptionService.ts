import httpClient from "@/services/httpClient";
import { API_ENDPOINTS } from "@/utils/backendAPIs";
import { getCompanyId } from "@/services/authStorage";
import type {
    ApiResponse,
    SubscriptionStatusResponse,
    SubscriptionResponse,
    SubscriptionPlan,
    CreatePaymentIntentRequest,
    PaymentIntentResponse,
    SubscriptionPurchaseRequest,
    SubscriptionHistory,
} from "../types";

export const getSubscriptionStatus = async (): Promise<
    ApiResponse<SubscriptionStatusResponse>
> => {
    const companyId = getCompanyId();
    if (!companyId) {
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

export const getSubscriptionPlans = async (): Promise<
    ApiResponse<SubscriptionPlan[]>
> => {
    const response = await httpClient.get<ApiResponse<SubscriptionPlan[]>>(
        API_ENDPOINTS.SUBSCRIPTIONS.PLANS
    );
    return response.data;
};

export const getSubscriptionPlan = async (
    planId: string
): Promise<ApiResponse<SubscriptionPlan>> => {
    const response = await httpClient.get<ApiResponse<SubscriptionPlan>>(
        API_ENDPOINTS.SUBSCRIPTIONS.PLAN(planId)
    );
    return response.data;
};

export const createPaymentIntent = async (
    request: CreatePaymentIntentRequest
): Promise<ApiResponse<PaymentIntentResponse>> => {
    const response = await httpClient.post<ApiResponse<PaymentIntentResponse>>(
        API_ENDPOINTS.SUBSCRIPTIONS.CREATE_PAYMENT_INTENT,
        request
    );
    return response.data;
};

export const purchaseSubscription = async (
    request: SubscriptionPurchaseRequest
): Promise<ApiResponse<SubscriptionStatusResponse>> => {
    const response = await httpClient.post<ApiResponse<SubscriptionStatusResponse>>(
        API_ENDPOINTS.SUBSCRIPTIONS.PURCHASE,
        request
    );
    return response.data;
};

export const getSubscriptionHistory = async (): Promise<
    ApiResponse<SubscriptionHistory[]>
> => {
    const companyId = getCompanyId();
    if (!companyId) {
        return {
            success: true,
            message: "No company ID found",
            data: [],
        };
    }
    const response = await httpClient.get<ApiResponse<SubscriptionHistory[]>>(
        API_ENDPOINTS.SUBSCRIPTIONS.HISTORY(companyId)
    );
    return response.data;
};

/**
 * Get subscription by company ID (internal endpoint)
 */
export const getSubscriptionByCompanyId = async (): Promise<
    ApiResponse<SubscriptionResponse>
> => {
    const companyId = getCompanyId();
    if (!companyId) {
        throw new Error("No company ID found");
    }
    const response = await httpClient.get<ApiResponse<SubscriptionResponse>>(
        API_ENDPOINTS.SUBSCRIPTIONS.GET_BY_COMPANY(companyId)
    );
    return response.data;
};

export const cancelSubscription = async (): Promise<
    ApiResponse<SubscriptionStatusResponse>
> => {
    const companyId = getCompanyId();
    if (!companyId) {
        throw new Error("No company ID found");
    }
    
    // First, get the subscription to retrieve its ID
    const subscriptionResponse = await getSubscriptionByCompanyId();
    if (!subscriptionResponse.success || !subscriptionResponse.data?.id) {
        throw new Error("No active subscription found for this company");
    }
    
    const subscriptionId = subscriptionResponse.data.id;
    
    // Cancel using the subscription ID (PATCH request)
    const response = await httpClient.patch<ApiResponse<SubscriptionStatusResponse>>(
        API_ENDPOINTS.SUBSCRIPTIONS.CANCEL(subscriptionId)
    );
    return response.data;
};

export const renewSubscription = async (
    planId: string
): Promise<ApiResponse<SubscriptionStatusResponse>> => {
    const companyId = getCompanyId();
    if (!companyId) {
        throw new Error("No company ID found");
    }
    const response = await httpClient.post<ApiResponse<SubscriptionStatusResponse>>(
        API_ENDPOINTS.SUBSCRIPTIONS.RENEW(companyId),
        { planId }
    );
    return response.data;
};

const SubscriptionService = {
    getSubscriptionStatus,
    checkIsPremium,
    getSubscriptionPlans,
    getSubscriptionPlan,
    createPaymentIntent,
    purchaseSubscription,
    getSubscriptionHistory,
    getSubscriptionByCompanyId,
    cancelSubscription,
    renewSubscription,
};

export default SubscriptionService;
