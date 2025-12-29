// Subscription Types

import { SUBSCRIPTION_STATUS } from "@/utils/constants";

// Subscription Status enum
export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];

// Subscription Status Response (from external API)
export interface SubscriptionStatusResponse {
    companyId: string;
    status: SubscriptionStatus;
    endAt: string | null;
    isPremium: boolean;
}

// Full Subscription Response (from internal API)
export interface SubscriptionResponse {
    id: string;
    companyId: string;
    status: SubscriptionStatus;
    startAt: string;
    endAt: string;
    isPremium: boolean;
    createdAt: string;
    updatedAt: string;
}

// Create Subscription Request
export interface CreateSubscriptionRequest {
    companyId: string;
    status?: SubscriptionStatus;
    startAt?: string;
    endAt?: string;
}

// Update Subscription Request
export interface UpdateSubscriptionRequest {
    status?: SubscriptionStatus;
    startAt?: string;
    endAt?: string;
}

// Common API Response Wrapper
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
