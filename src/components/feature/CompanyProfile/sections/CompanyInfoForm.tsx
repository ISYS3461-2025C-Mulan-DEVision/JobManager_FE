import React, { useState, useRef } from "react";
import { Button, Input, Textarea, Alert, Spinner } from "@/components/ui";
import { Pencil, Camera, X, Check } from "lucide-react";
import { useCompanyInfoForm } from "../hooks/useCompanyInfoForm";

// Editable Section Wrapper
interface EditableSectionProps {
    title: string;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    isSaving?: boolean;
    children: React.ReactNode;
}

const EditableSection: React.FC<EditableSectionProps> = ({
    title,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    isSaving = false,
    children,
}) => {
    return (
        <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                {isEditing ? (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCancel}
                            disabled={isSaving}
                        >
                            <span className="flex items-center">
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                            </span>
                        </Button>
                        <Button
                            size="sm"
                            onClick={onSave}
                            isLoading={isSaving}
                        >
                            <span className="flex items-center">
                                <Check className="w-4 h-4 mr-1" />
                                Save Changes
                            </span>
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onEdit}
                    >
                        <span className="flex items-center">
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                        </span>
                    </Button>
                )}
            </div>
            {children}
        </div>
    );
};

// Banner with Logo Component
interface BannerWithLogoProps {
    bannerUrl?: string;
    logoUrl?: string;
    onBannerUpload: (file: File) => void;
    onLogoUpload: (file: File) => void;
}

const BannerWithLogo: React.FC<BannerWithLogoProps> = ({
    bannerUrl,
    logoUrl,
    onBannerUpload,
    onLogoUpload,
}) => {
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onBannerUpload(file);
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onLogoUpload(file);
    };

    return (
        <div className="relative mb-16">
            {/* Banner */}
            <div className="relative h-48 w-full rounded-xl overflow-hidden bg-gradient-to-r from-slate-100 to-slate-200">
                {bannerUrl ? (
                    <img
                        src={bannerUrl}
                        alt="Company Banner"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-800" />
                )}
                {/* Edit Banner Button */}
                <button
                    onClick={() => bannerInputRef.current?.click()}
                    className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 hover:bg-white text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer"
                >
                    <Pencil className="w-4 h-4" />
                    Edit Banner
                </button>
                <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="hidden"
                />
            </div>

            {/* Logo */}
            <div className="absolute -bottom-12 left-8">
                <div className="relative">
                    <div className="w-28 h-28 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt="Company Logo"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                        )}
                    </div>
                    {/* Edit Logo Button */}
                    <button
                        onClick={() => logoInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                    <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                    />
                </div>
            </div>
        </div>
    );
};

export const CompanyInfoForm: React.FC = () => {
    const {
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
    } = useCompanyInfoForm();

    // Track which sections are being edited
    const [editingSections, setEditingSections] = useState<{
        basicInfo: boolean;
        location: boolean;
        socialLinks: boolean;
        about: boolean;
    }>({
        basicInfo: false,
        location: false,
        socialLinks: false,
        about: false,
    });

    // Store original values for cancel functionality
    const [originalData, setOriginalData] = useState(formData);

    const startEditing = (section: keyof typeof editingSections) => {
        setOriginalData({ ...formData });
        setEditingSections((prev) => ({ ...prev, [section]: true }));
    };

    const cancelEditing = (section: keyof typeof editingSections) => {
        // Restore original values
        Object.keys(originalData).forEach((key) => {
            handleChange(key as keyof typeof formData, originalData[key as keyof typeof originalData]);
        });
        setEditingSections((prev) => ({ ...prev, [section]: false }));
    };

    const saveSection = async (section: keyof typeof editingSections) => {
        await handleSubmit();
        setEditingSections((prev) => ({ ...prev, [section]: false }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Update your company's public profile information.
                </p>
            </div>

            {error && (
                <Alert type="error" onClose={() => { }}>
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert type="success" onClose={() => { }}>
                    {successMessage}
                </Alert>
            )}

            {/* Banner with Logo */}
            <BannerWithLogo
                bannerUrl={profile?.bannerUrl}
                logoUrl={profile?.logoUrl}
                onBannerUpload={handleBannerUpload}
                onLogoUpload={handleLogoUpload}
            />

            {/* Basic Information */}
            <EditableSection
                title="Basic Information"
                isEditing={editingSections.basicInfo}
                onEdit={() => startEditing("basicInfo")}
                onSave={() => saveSection("basicInfo")}
                onCancel={() => cancelEditing("basicInfo")}
                isSaving={isSaving}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Company Name"
                        value={formData.companyName}
                        onChange={(e) => handleChange("companyName", e.target.value)}
                        disabled={!editingSections.basicInfo}
                        fullWidth
                    />
                    <Input
                        label="Phone Number"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        disabled={!editingSections.basicInfo}
                        fullWidth
                    />
                    <Input
                        label="Website"
                        value={formData.website}
                        onChange={(e) => handleChange("website", e.target.value)}
                        placeholder="https://example.com"
                        disabled={!editingSections.basicInfo}
                        fullWidth
                    />
                    <Input
                        label="Industry"
                        value={formData.industry}
                        onChange={(e) => handleChange("industry", e.target.value)}
                        disabled={!editingSections.basicInfo}
                        fullWidth
                    />
                    <Input
                        label="Founded Year"
                        type="number"
                        value={formData.foundedYear}
                        onChange={(e) => handleChange("foundedYear", e.target.value)}
                        disabled={!editingSections.basicInfo}
                        fullWidth
                    />
                    <Input
                        label="Employee Count"
                        value={formData.employeeCount}
                        onChange={(e) => handleChange("employeeCount", e.target.value)}
                        placeholder="e.g., 50-100"
                        disabled={!editingSections.basicInfo}
                        fullWidth
                    />
                </div>
            </EditableSection>

            {/* Location */}
            <EditableSection
                title="Location"
                isEditing={editingSections.location}
                onEdit={() => startEditing("location")}
                onSave={() => saveSection("location")}
                onCancel={() => cancelEditing("location")}
                isSaving={isSaving}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <Input
                        label="Headquarters"
                        value={formData.headquarters}
                        onChange={(e) => handleChange("headquarters", e.target.value)}
                        disabled={!editingSections.location}
                        fullWidth
                    /> */}
                    <Input
                        label="Street Address"
                        value={formData.streetAddress}
                        onChange={(e) => handleChange("streetAddress", e.target.value)}
                        disabled={!editingSections.location}
                        fullWidth
                    />
                    <Input
                        label="City"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        disabled={!editingSections.location}
                        fullWidth
                    />
                    <Input
                        label="Country"
                        value={formData.country}
                        onChange={(e) => handleChange("country", e.target.value)}
                        disabled={!editingSections.location}
                        fullWidth
                    />
                </div>
            </EditableSection>

            {/* Social Links */}
            <EditableSection
                title="Social Links"
                isEditing={editingSections.socialLinks}
                onEdit={() => startEditing("socialLinks")}
                onSave={() => saveSection("socialLinks")}
                onCancel={() => cancelEditing("socialLinks")}
                isSaving={isSaving}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="LinkedIn URL"
                        value={formData.linkedinUrl}
                        onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                        placeholder="https://linkedin.com/company/..."
                        disabled={!editingSections.socialLinks}
                        fullWidth
                    />
                    <Input
                        label="Facebook URL"
                        value={formData.facebookUrl}
                        onChange={(e) => handleChange("facebookUrl", e.target.value)}
                        placeholder="https://facebook.com/..."
                        disabled={!editingSections.socialLinks}
                        fullWidth
                    />
                </div>
            </EditableSection>

            {/* About */}
            <EditableSection
                title="About"
                isEditing={editingSections.about}
                onEdit={() => startEditing("about")}
                onSave={() => saveSection("about")}
                onCancel={() => cancelEditing("about")}
                isSaving={isSaving}
            >
                <div className="space-y-4">
                    {/* <Textarea
                        label="Company Description"
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        rows={4}
                        placeholder="Describe your company..."
                        disabled={!editingSections.about}
                    /> */}
                    <Textarea
                        label="About Us"
                        value={formData.aboutUs}
                        onChange={(e) => handleChange("aboutUs", e.target.value)}
                        rows={4}
                        placeholder="Tell candidates about your company culture..."
                        disabled={!editingSections.about}
                    />
                    <Textarea
                        label="Who We Seek"
                        value={formData.whoWeSeek}
                        onChange={(e) => handleChange("whoWeSeek", e.target.value)}
                        rows={4}
                        placeholder="Describe the type of candidates you're looking for..."
                        disabled={!editingSections.about}
                    />
                </div>
            </EditableSection>
        </div>
    );
};

export default CompanyInfoForm;
