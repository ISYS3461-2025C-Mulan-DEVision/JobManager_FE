import httpClient from "@/services/httpClient";
import { API_ENDPOINTS } from "@/utils/backendAPIs";
import { getStoredUser } from "@/services/authStorage";
import type {
    ApiResponse,
    SearchProfileResponse,
    CreateSearchProfileRequest,
    UpdateSearchProfileRequest,
    UpdateStatusRequest,
    SubscriptionStatusResponse,
    ApplicantSearchResponse,
    SearchState,
    Country,
} from "../types";

// ============================================================
// Helper Functions
// ============================================================

const getCompanyId = (): string => {
    const user = getStoredUser();
    return user?.companyId || "";
};

// ============================================================
// Applicant Search API
// TODO: Search endpoint not finalized - applicant attributes may change
// ============================================================

export const searchApplicants = async (
    searchState: SearchState
): Promise<ApiResponse<ApplicantSearchResponse>> => {
    // Build query params from search state
    const params = new URLSearchParams();

    if (searchState.keyword) {
        params.append("keyword", searchState.keyword);
    }
    if (searchState.countryCode) {
        params.append("countryCode", searchState.countryCode);
    }
    if (searchState.employmentTypes.length > 0) {
        searchState.employmentTypes.forEach((type) => {
            params.append("employmentTypes", type);
        });
    }
    if (searchState.highestDegree) {
        params.append("highestDegree", searchState.highestDegree);
    }
    if (searchState.minSalary !== undefined) {
        params.append("minSalary", searchState.minSalary.toString());
    }
    if (searchState.maxSalary !== undefined) {
        params.append("maxSalary", searchState.maxSalary.toString());
    }
    if (searchState.skillIds.length > 0) {
        searchState.skillIds.forEach((id) => {
            params.append("skillIds", id);
        });
    }
    if (searchState.sortBy) {
        params.append("sortBy", searchState.sortBy);
    }
    params.append("page", searchState.page.toString());
    params.append("size", searchState.pageSize.toString());

    const response = await httpClient.get<ApiResponse<ApplicantSearchResponse>>(
        `${API_ENDPOINTS.APPLICANT_SEARCH.SEARCH}?${params.toString()}`
    );
    return response.data;
};

// ============================================================
// Search Profile APIs (Premium Feature)
// ============================================================

export const createSearchProfile = async (
    request: Omit<CreateSearchProfileRequest, "companyId">
): Promise<ApiResponse<SearchProfileResponse>> => {
    const companyId = getCompanyId();
    const payload: CreateSearchProfileRequest = {
        ...request,
        companyId,
    };
    const response = await httpClient.post<ApiResponse<SearchProfileResponse>>(
        API_ENDPOINTS.SEARCH_PROFILES.CREATE,
        payload
    );
    return response.data;
};

export const getSearchProfile = async (
    profileId: string
): Promise<ApiResponse<SearchProfileResponse>> => {
    const response = await httpClient.get<ApiResponse<SearchProfileResponse>>(
        API_ENDPOINTS.SEARCH_PROFILES.GET(profileId)
    );
    return response.data;
};

export const updateSearchProfile = async (
    profileId: string,
    request: UpdateSearchProfileRequest
): Promise<ApiResponse<SearchProfileResponse>> => {
    const response = await httpClient.put<ApiResponse<SearchProfileResponse>>(
        API_ENDPOINTS.SEARCH_PROFILES.UPDATE(profileId),
        request
    );
    return response.data;
};

export const deleteSearchProfile = async (
    profileId: string
): Promise<ApiResponse<void>> => {
    const response = await httpClient.delete<ApiResponse<void>>(
        API_ENDPOINTS.SEARCH_PROFILES.DELETE(profileId)
    );
    return response.data;
};

export const getCompanySearchProfiles = async (): Promise<
    ApiResponse<SearchProfileResponse[]>
> => {
    const companyId = getCompanyId();
    const response = await httpClient.get<ApiResponse<SearchProfileResponse[]>>(
        API_ENDPOINTS.SEARCH_PROFILES.BY_COMPANY(companyId)
    );
    return response.data;
};

export const getCompanyActiveSearchProfiles = async (): Promise<
    ApiResponse<SearchProfileResponse[]>
> => {
    const companyId = getCompanyId();
    const response = await httpClient.get<ApiResponse<SearchProfileResponse[]>>(
        API_ENDPOINTS.SEARCH_PROFILES.ACTIVE_BY_COMPANY(companyId)
    );
    return response.data;
};

export const updateSearchProfileStatus = async (
    profileId: string,
    request: UpdateStatusRequest
): Promise<ApiResponse<SearchProfileResponse>> => {
    const response = await httpClient.patch<ApiResponse<SearchProfileResponse>>(
        API_ENDPOINTS.SEARCH_PROFILES.UPDATE_STATUS(profileId),
        request
    );
    return response.data;
};

// ============================================================
// Subscription APIs
// ============================================================

export const getSubscriptionStatus = async (): Promise<
    ApiResponse<SubscriptionStatusResponse>
> => {
    const companyId = getCompanyId();
    const response = await httpClient.get<ApiResponse<SubscriptionStatusResponse>>(
        API_ENDPOINTS.SUBSCRIPTIONS.STATUS(companyId)
    );
    return response.data;
};

export const checkIsPremium = async (): Promise<ApiResponse<boolean>> => {
    const companyId = getCompanyId();
    const response = await httpClient.get<ApiResponse<boolean>>(
        API_ENDPOINTS.SUBSCRIPTIONS.IS_PREMIUM(companyId)
    );
    return response.data;
};

// ============================================================
// Countries API (from auth service)
// ============================================================

export const getCountries = async (): Promise<
    ApiResponse<Country[]>
> => {
    const response = await httpClient.get<ApiResponse<Country[]>>(
        "/auth/countries"
    );
    return response.data;
};

// ============================================================
// Export as service object
// ============================================================

const ApplicantSearchService = {
    // Search
    searchApplicants,
    // Search Profiles
    createSearchProfile,
    getSearchProfile,
    updateSearchProfile,
    deleteSearchProfile,
    getCompanySearchProfiles,
    getCompanyActiveSearchProfiles,
    updateSearchProfileStatus,
    // Subscription
    getSubscriptionStatus,
    checkIsPremium,
    // Countries
    getCountries,
};

export default ApplicantSearchService;
