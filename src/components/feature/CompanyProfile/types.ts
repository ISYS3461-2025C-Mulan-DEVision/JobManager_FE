// Company Profile Types

export interface CompanyProfile {
    id: string;
    companyName: string;
    email: string;
    phone?: string;
    city?: string;
    streetAddress?: string;
    country?: string;
    logoUrl?: string;
    bannerUrl?: string;
    description?: string;
    website?: string;
    industry?: string;
    foundedYear?: number;
    employeeCount?: string;
    headquarters?: string;
    linkedinUrl?: string;
    facebookUrl?: string;
    aboutUs?: string;
    whoWeSeek?: string;
}

export interface CompanyProfileFormData {
    companyName: string;
    phone: string;
    city: string;
    streetAddress: string;
    country: string;
    description: string;
    website: string;
    industry: string;
    foundedYear: string;
    employeeCount: string;
    headquarters: string;
    linkedinUrl: string;
    facebookUrl: string;
    aboutUs: string;
    whoWeSeek: string;
}

export interface CompanyMedia {
    id: string;
    companyId: string;
    mediaType: "IMAGE" | "VIDEO" | "DOCUMENT" | "GALLERY";
    url: string;
    title?: string;
    description?: string;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface MediaUploadPayload {
    file: File;
    mediaType: "IMAGE" | "VIDEO" | "DOCUMENT" | "GALLERY";
    title?: string;
    description?: string;
}

export interface MediaReorderItem {
    mediaId: string;
    displayOrder: number;
}

export interface ChangeEmailPayload {
    newEmail: string;
    password: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export type ProfileSection =
    | "company-info"
    | "media-showcase"
    | "account-security"
    | "notifications"
    | "payment-subscription";
