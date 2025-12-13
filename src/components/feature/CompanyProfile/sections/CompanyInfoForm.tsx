import React, { useRef } from "react";
import { Button, Input, Alert, Spinner } from "@/components/ui";
import { useCompanyInfoForm } from "../hooks/useCompanyInfoForm";

// Textarea component since Input doesn't support multiline
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, error, className, id, ...props }) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label htmlFor={textareaId} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-900 placeholder:text-gray-400 ${error
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } ${className || ""}`}
                {...props}
            />
            {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
    );
};

// Image upload component
interface ImageUploadProps {
    label: string;
    currentImage?: string;
    onUpload: (file: File) => void;
    aspectRatio?: "square" | "banner";
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    label,
    currentImage,
    onUpload,
    aspectRatio = "square",
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div
                className={`relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-blue-400 transition-colors cursor-pointer ${aspectRatio === "banner" ? "h-32 w-full" : "h-32 w-32"
                    }`}
                onClick={handleClick}
            >
                {currentImage ? (
                    <img
                        src={currentImage}
                        alt={label}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-xs">Click to upload</span>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                />
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
