import { useState, useEffect, useCallback } from "react";
import type { CompanyProfile, CompanyProfileFormData } from "../types";
import {
    getCompanyProfile,
    updateCompanyProfile,
    uploadLogo,
    uploadBanner,
} from "../api/CompanyProfileService";

interface UseCompanyInfoFormReturn {
    formData: CompanyProfileFormData;
    profile: CompanyProfile | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    successMessage: string | null;
    handleChange: (field: keyof CompanyProfileFormData, value: string) => void;
    handleSubmit: () => Promise<void>;
    handleLogoUpload: (file: File) => Promise<void>;
    handleBannerUpload: (file: File) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const initialFormData: CompanyProfileFormData = {
    companyName: "",
    phone: "",
    city: "",
    streetAddress: "",
    country: "",
    description: "",
    website: "",
    industry: "",
    foundedYear: "",
    employeeCount: "",
    headquarters: "",
    linkedinUrl: "",
    facebookUrl: "",
    aboutUs: "",
    whoWeSeek: "",
};

export function useCompanyInfoForm(): UseCompanyInfoFormReturn {
    const [formData, setFormData] = useState<CompanyProfileFormData>(initialFormData);
    const [profile, setProfile] = useState<CompanyProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getCompanyProfile();
            setProfile(data);
            setFormData({
                companyName: data.companyName || "",
                phone: data.phone || "",
                city: data.city || "",
                streetAddress: data.streetAddress || "",
                country: data.country || "",
                description: data.description || "",
                website: data.website || "",
                industry: data.industry || "",
                foundedYear: data.foundedYear?.toString() || "",
                employeeCount: data.employeeCount || "",
                headquarters: data.headquarters || "",
                linkedinUrl: data.linkedinUrl || "",
                facebookUrl: data.facebookUrl || "",
                aboutUs: data.aboutUs || "",
                whoWeSeek: data.whoWeSeek || "",
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load profile");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = useCallback((field: keyof CompanyProfileFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setSuccessMessage(null);
    }, []);

    const handleSubmit = useCallback(async () => {
        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const updatedProfile = await updateCompanyProfile({
                ...formData,
                foundedYear: formData.foundedYear || undefined,
            });
            setProfile(updatedProfile);
            setSuccessMessage("Profile updated successfully!");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save changes");
        } finally {
            setIsSaving(false);
        }
    }, [formData]);

    const handleLogoUpload = useCallback(async (file: File) => {
        setError(null);
        try {
            const result = await uploadLogo(file);
            setProfile((prev) => prev ? { ...prev, logoUrl: result.logoUrl } : prev);
            setSuccessMessage("Logo uploaded successfully!");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload logo");
        }
    }, []);

    const handleBannerUpload = useCallback(async (file: File) => {
        setError(null);
        try {
            const result = await uploadBanner(file);
            setProfile((prev) => prev ? { ...prev, bannerUrl: result.bannerUrl } : prev);
            setSuccessMessage("Banner uploaded successfully!");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload banner");
        }
    }, []);

    return {
        formData,
        profile,
        isLoading,
        isSaving,
        error,
        successMessage,
        handleChange,
        handleSubmit,
        handleLogoUpload,
        handleBannerUpload,
        refreshProfile: fetchProfile,
    };
}
