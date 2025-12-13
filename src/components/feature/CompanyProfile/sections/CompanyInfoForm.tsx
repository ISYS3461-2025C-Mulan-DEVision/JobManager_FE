import React from "react";
import { Button, Input, Textarea, ImageUpload, Alert, Spinner } from "@/components/ui";
import { useCompanyInfoForm } from "../hooks/useCompanyInfoForm";

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

            {/* Logo and Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload
                    label="Company Logo"
                    currentImage={profile?.logoUrl}
                    onUpload={handleLogoUpload}
                    aspectRatio="square"
                />
                <ImageUpload
                    label="Company Banner"
                    currentImage={profile?.bannerUrl}
                    onUpload={handleBannerUpload}
                    aspectRatio="banner"
                />
            </div>

            {/* Basic Information */}
            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Company Name"
                        value={formData.companyName}
                        onChange={(e) => handleChange("companyName", e.target.value)}
                        fullWidth
                    />
                    <Input
                        label="Phone Number"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        fullWidth
                    />
                    <Input
                        label="Website"
                        value={formData.website}
                        onChange={(e) => handleChange("website", e.target.value)}
                        placeholder="https://example.com"
                        fullWidth
                    />
                    <Input
                        label="Industry"
                        value={formData.industry}
                        onChange={(e) => handleChange("industry", e.target.value)}
                        fullWidth
                    />
                    <Input
                        label="Founded Year"
                        type="number"
                        value={formData.foundedYear}
                        onChange={(e) => handleChange("foundedYear", e.target.value)}
                        fullWidth
                    />
                    <Input
                        label="Employee Count"
                        value={formData.employeeCount}
                        onChange={(e) => handleChange("employeeCount", e.target.value)}
                        placeholder="e.g., 50-100"
                        fullWidth
                    />
                </div>
            </div>

            {/* Location */}
            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Headquarters"
                        value={formData.headquarters}
                        onChange={(e) => handleChange("headquarters", e.target.value)}
                        fullWidth
                    />
                    <Input
                        label="Country"
                        value={formData.country}
                        onChange={(e) => handleChange("country", e.target.value)}
                        fullWidth
                    />
                    <Input
                        label="City"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        fullWidth
                    />
                    <Input
                        label="Street Address"
                        value={formData.streetAddress}
                        onChange={(e) => handleChange("streetAddress", e.target.value)}
                        fullWidth
                    />
                </div>
            </div>

            {/* Social Links */}
            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="LinkedIn URL"
                        value={formData.linkedinUrl}
                        onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                        placeholder="https://linkedin.com/company/..."
                        fullWidth
                    />
                    <Input
                        label="Facebook URL"
                        value={formData.facebookUrl}
                        onChange={(e) => handleChange("facebookUrl", e.target.value)}
                        placeholder="https://facebook.com/..."
                        fullWidth
                    />
                </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
                <div className="space-y-4">
                    <Textarea
                        label="Company Description"
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        rows={4}
                        placeholder="Describe your company..."
                    />
                    <Textarea
                        label="About Us"
                        value={formData.aboutUs}
                        onChange={(e) => handleChange("aboutUs", e.target.value)}
                        rows={4}
                        placeholder="Tell candidates about your company culture..."
                    />
                    <Textarea
                        label="Who We Seek"
                        value={formData.whoWeSeek}
                        onChange={(e) => handleChange("whoWeSeek", e.target.value)}
                        rows={4}
                        placeholder="Describe the type of candidates you're looking for..."
                    />
                </div>
            </div>

            {/* Save Button */}
            <div className="border-t border-gray-200 pt-6 flex justify-end">
                <Button onClick={handleSubmit} isLoading={isSaving}>
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default CompanyInfoForm;
