// Company Profile API Service
import type {
    CompanyProfile,
    CompanyProfileFormData,
    CompanyMedia,
    MediaUploadPayload,
    MediaReorderItem,
} from "../types";

const COMPANY_BASE_URL = import.meta.env.VITE_COMPANY_API_URL || "http://localhost:8082/api/companies";

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem("access_token");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

const getAuthHeadersFormData = (): HeadersInit => {
    const token = localStorage.getItem("access_token");
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Get company ID from storage
const getCompanyId = (): string => {
    return localStorage.getItem("company_id") || "";
};

// Profile APIs
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
    profileData: Partial<CompanyProfileFormData>
): Promise<CompanyProfile> => {
    const companyId = getCompanyId();
    const response = await fetch(`${COMPANY_BASE_URL}/${companyId}/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
    });

    if (!response.ok) {
        throw new Error("Failed to update company profile");
    }

    const data = await response.json();
    return data.data || data;
};

// Media APIs
export const uploadLogo = async (file: File): Promise<{ logoUrl: string }> => {
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

export const uploadBanner = async (file: File): Promise<{ bannerUrl: string }> => {
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
    formData.append("mediaType", payload.mediaType);
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
    return data.data || data || [];
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
    const response = await fetch(`${COMPANY_BASE_URL}/${companyId}/media/reorder`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(reorderItems),
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
