import type {
    Company,
    CompanyProfile,
    CompanyFormData,
    ProfileFormData,
    CompanyMedia,
    MediaUploadPayload,
    MediaReorderItem,
} from "../types";
import { getAccessToken, getStoredUser } from "@/services/authStorage";

const COMPANY_BASE_URL = import.meta.env.VITE_COMPANY_API_URL || "http://localhost:8082/api/companies";

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
    const token = getAccessToken();
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

const getAuthHeadersFormData = (): HeadersInit => {
    const token = getAccessToken();
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Get company ID from storage
const getCompanyId = (): string => {
    const user = getStoredUser();
    return user?.companyId || "";
};

// Company APIs (GET/PUT /companies/{companyId})
export const getCompany = async (): Promise<Company> => {
    const companyId = getCompanyId();
    const response = await fetch(`${COMPANY_BASE_URL}/${companyId}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch company");
    }

    const data = await response.json();
    return data.data || data;
};

export const updateCompany = async (
    companyData: Partial<CompanyFormData>
): Promise<Company> => {
    const companyId = getCompanyId();
    const response = await fetch(`${COMPANY_BASE_URL}/${companyId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(companyData),
    });

    if (!response.ok) {
        throw new Error("Failed to update company");
    }

    const data = await response.json();
    return data.data || data;
};

// Profile APIs (GET/PUT /companies/{companyId}/profile)
export const getCompanyProfile = async (): Promise<CompanyProfile> => {
    const companyId = getCompanyId();
    const response = await fetch(`${COMPANY_BASE_URL}/${companyId}/profile`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch company profile");
    }

    const data = await response.json();
    return data.data || data;
};

export const updateCompanyProfile = async (
    profileData: Partial<ProfileFormData>
): Promise<CompanyProfile> => {
    const companyId = getCompanyId();
    // Convert foundedYear to number if present
    const payload = {
        ...profileData,
        foundedYear: profileData.foundedYear ? parseInt(profileData.foundedYear, 10) : undefined,
    };
    const response = await fetch(`${COMPANY_BASE_URL}/${companyId}/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Failed to update company profile");
    }

    const data = await response.json();
    return data.data || data;
};

// Media APIs
export const uploadLogo = async (file: File): Promise<{ url: string }> => {
    const companyId = getCompanyId();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${COMPANY_BASE_URL}/${companyId}/media/logo`, {
        method: "POST",
        headers: getAuthHeadersFormData(),
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload logo");
    }

    const data = await response.json();
    return data.data || data;
};

export const uploadBanner = async (file: File): Promise<{ url: string }> => {
    const companyId = getCompanyId();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${COMPANY_BASE_URL}/${companyId}/media/banner`, {
        method: "POST",
        headers: getAuthHeadersFormData(),
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload banner");
    }

    const data = await response.json();
    return data.data || data;
};

export const uploadMedia = async (payload: MediaUploadPayload): Promise<CompanyMedia> => {
    const companyId = getCompanyId();
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("type", payload.mediaType); // Backend expects 'type' field
    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);

    const response = await fetch(`${COMPANY_BASE_URL}/${companyId}/media`, {
        method: "POST",
        headers: getAuthHeadersFormData(),
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload media");
    }

    const data = await response.json();
    return data.data || data;
};

export const getAllMedia = async (): Promise<CompanyMedia[]> => {
    const companyId = getCompanyId();
    const response = await fetch(`${COMPANY_BASE_URL}/${companyId}/media`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch media");
    }

    const data = await response.json();
    // Handle paginated response: { data: { content: [...], page, size, totalElements, ... } }
    if (data.data?.content) {
        return data.data.content;
    }
    // Fallback for direct array response
    return Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
};

export const getMediaById = async (mediaId: string): Promise<CompanyMedia> => {
    const companyId = getCompanyId();
    const response = await fetch(`${COMPANY_BASE_URL}/${companyId}/media/${mediaId}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch media");
    }

    const data = await response.json();
    return data.data || data;
};

export const updateMedia = async (
    mediaId: string,
    updateData: { title?: string; description?: string; displayOrder?: number }
): Promise<CompanyMedia> => {
    const companyId = getCompanyId();
    const response = await fetch(`${COMPANY_BASE_URL}/${companyId}/media/${mediaId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
    });

    if (!response.ok) {
        throw new Error("Failed to update media");
    }

    const data = await response.json();
    return data.data || data;
};

export const reorderMedia = async (reorderItems: MediaReorderItem[]): Promise<void> => {
    const companyId = getCompanyId();
    // Backend expects array of UUIDs in desired order, not objects with mediaId/displayOrder
    // Sort by displayOrder and extract just the IDs
    const orderedIds = reorderItems
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(item => item.mediaId);
    
    const response = await fetch(`${COMPANY_BASE_URL}/${companyId}/media/reorder`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(orderedIds),
    });

    if (!response.ok) {
        throw new Error("Failed to reorder media");
    }
};

export const deleteMedia = async (mediaId: string): Promise<void> => {
    const companyId = getCompanyId();
    const response = await fetch(`${COMPANY_BASE_URL}/${companyId}/media/${mediaId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to delete media");
    }
};

const CompanyProfileService = {
    getCompany,
    updateCompany,
    getCompanyProfile,
    updateCompanyProfile,
    uploadLogo,
    uploadBanner,
    uploadMedia,
    getAllMedia,
    getMediaById,
    updateMedia,
    reorderMedia,
    deleteMedia,
};

export default CompanyProfileService;
