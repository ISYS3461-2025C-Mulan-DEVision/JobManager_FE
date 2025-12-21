import React, {
    useState,
    useRef,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import {
    Button,
    Input,
    Textarea,
    Alert,
    Spinner,
    LabeledValue,
    SocialLink,
    InfoCard,
    Select,
    PhoneInput,
} from "@/components/ui";
import { HeadlessModal } from "@/components/headless";
import {
    Pencil,
    Camera,
    X,
    Briefcase,
    Users,
    Calendar,
    Globe,
    Linkedin,
    MapPin,
    Phone,
    Building2,
} from "lucide-react";
import { useCompanyInfoForm } from "../hooks/useCompanyInfoForm";
import { companyValidators, COMPANY_SIZE_OPTIONS } from "@/utils/validators";
import type { CompanyProfileFormData } from "../types";

// Banner with Logo Component
interface BannerWithLogoProps {
    bannerUrl?: string;
    logoUrl?: string;
    companyName?: string;
    onBannerUpload: (file: File) => void;
    onLogoUpload: (file: File) => void;
}

const BannerWithLogo: React.FC<BannerWithLogoProps> = ({
    bannerUrl,
    logoUrl,
    companyName,
    onBannerUpload,
    onLogoUpload,
}) => {
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const [bannerLoaded, setBannerLoaded] = useState(false);
    const [logoLoaded, setLogoLoaded] = useState(false);

    // Preload critical images for faster perceived loading
    useEffect(() => {
        if (logoUrl) {
            const img = new Image();
            img.src = logoUrl;
        }
        if (bannerUrl) {
            const img = new Image();
            img.src = bannerUrl;
        }
    }, [logoUrl, bannerUrl]);

    // Reset loaded state when URLs change
    useEffect(() => {
        setBannerLoaded(false);
    }, [bannerUrl]);

    useEffect(() => {
        setLogoLoaded(false);
    }, [logoUrl]);

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onBannerUpload(file);
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onLogoUpload(file);
    };

    return (
        <div className="relative mb-20">
            {/* Banner */}
            <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-gradient-to-r from-slate-100 to-slate-200">
                {bannerUrl && !bannerLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                {bannerUrl ? (
                    <img
                        src={bannerUrl}
                        alt="Company Banner"
                        loading="eager"
                        onLoad={() => setBannerLoaded(true)}
                        ref={(img) => {
                            if (img?.complete) {
                                setBannerLoaded(true);
                            }
                        }}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                            bannerLoaded ? "opacity-100" : "opacity-0"
                        }`}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
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

            {/* Logo and Company Name */}
            <div className="absolute -bottom-16 left-8 flex items-end gap-5">
                {/* Logo */}
                <div className="relative">
                    <div className="w-32 h-32 rounded-2xl border-4 border-white bg-white shadow-lg overflow-hidden">
                        {logoUrl && !logoLoaded && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
                        )}
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt="Company Logo"
                                loading="eager"
                                onLoad={() => setLogoLoaded(true)}
                                ref={(img) => {
                                    if (img?.complete) {
                                        setLogoLoaded(true);
                                    }
                                }}
                                className={`w-full h-full object-cover transition-opacity duration-300 ${
                                    logoLoaded ? "opacity-100" : "opacity-0"
                                }`}
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                <Building2 className="w-12 h-12 text-slate-400" />
                            </div>
                        )}
                    </div>
                    {/* Edit Logo Button */}
                    <button
                        onClick={() => logoInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
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

                {/* Company Name */}
                {companyName && (
                    <div className="pb-2">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {companyName}
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
};

// Edit Modals
interface EditCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: {
        name: string;
        phone: string;
        streetAddress: string;
        city: string;
        countryCode: string;
    };
    onChange: (field: keyof CompanyProfileFormData, value: string) => void;
    onSave: () => Promise<void>;
    isSaving: boolean;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
    isOpen,
    onClose,
    formData,
    onChange,
    onSave,
    isSaving,
}) => {
    // Validation errors state
    const errors = useMemo(
        () => ({
            name: companyValidators.name(formData.name),
            phone: companyValidators.phone(formData.phone),
            streetAddress: companyValidators.streetAddress(
                formData.streetAddress
            ),
            city: companyValidators.city(formData.city),
            countryCode: companyValidators.countryCode(formData.countryCode),
        }),
        [formData]
    );

    const hasErrors = Object.values(errors).some(Boolean);

    const handleSave = async () => {
        if (hasErrors) return;
        await onSave();
        onClose();
    };

    return (
        <HeadlessModal
            isOpen={isOpen}
            onClose={onClose}
            overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Edit Company Information
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <Input
                        label="Company Name"
                        value={formData.name}
                        onChange={(e) => onChange("name", e.target.value)}
                        error={errors.name}
                        helperText="Max 255 characters"
                        fullWidth
                    />
                    <PhoneInput
                        label="Phone Number"
                        value={formData.phone}
                        onChange={(value) => onChange("phone", value)}
                        error={errors.phone}
                        helperText="Enter your company phone number with country code"
                        fullWidth
                    />
                    <Input
                        label="Street Address"
                        value={formData.streetAddress}
                        onChange={(e) =>
                            onChange("streetAddress", e.target.value)
                        }
                        error={errors.streetAddress}
                        helperText="Max 255 characters"
                        fullWidth
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="City"
                            value={formData.city}
                            onChange={(e) => onChange("city", e.target.value)}
                            error={errors.city}
                            helperText="Max 128 characters"
                            fullWidth
                        />
                        <Input
                            label="Country Code"
                            value={formData.countryCode}
                            onChange={(e) =>
                                onChange(
                                    "countryCode",
                                    e.target.value.toUpperCase()
                                )
                            }
                            error={errors.countryCode}
                            placeholder="e.g., VN, US"
                            helperText="2-3 uppercase letters (ISO 3166-1)"
                            fullWidth
                        />
                    </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        isLoading={isSaving}
                        disabled={hasErrors}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </HeadlessModal>
    );
};

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: {
        industry: string;
        companySize: string;
        foundedYear: string;
        websiteUrl: string;
        linkedinUrl: string;
    };
    onChange: (field: keyof CompanyProfileFormData, value: string) => void;
    onSave: () => Promise<void>;
    isSaving: boolean;
}

// Company size options for the dropdown
const companySizeOptions = [
    { value: "", label: "Select company size" },
    ...COMPANY_SIZE_OPTIONS.map((size) => ({
        value: size,
        label: `${size} Employees`,
    })),
];

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    formData,
    onChange,
    onSave,
    isSaving,
}) => {
    // Validation errors state
    const errors = useMemo(
        () => ({
            industry: companyValidators.industry(formData.industry),
            companySize: companyValidators.companySize(formData.companySize),
            foundedYear: companyValidators.foundedYear(formData.foundedYear),
            websiteUrl: companyValidators.websiteUrl(formData.websiteUrl),
            linkedinUrl: companyValidators.linkedinUrl(formData.linkedinUrl),
        }),
        [formData]
    );

    const hasErrors = Object.values(errors).some(Boolean);

    const handleSave = async () => {
        if (hasErrors) return;
        await onSave();
        onClose();
    };

    return (
        <HeadlessModal
            isOpen={isOpen}
            onClose={onClose}
            overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Edit Profile Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <Input
                        label="Industry"
                        value={formData.industry}
                        onChange={(e) => onChange("industry", e.target.value)}
                        error={errors.industry}
                        placeholder="e.g., Technology"
                        helperText="Max 128 characters"
                        fullWidth
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Company Size"
                            value={formData.companySize}
                            onChange={(e) =>
                                onChange("companySize", e.target.value)
                            }
                            options={companySizeOptions}
                            error={errors.companySize}
                            fullWidth
                        />
                        <Input
                            label="Founded Year"
                            type="number"
                            value={formData.foundedYear}
                            onChange={(e) =>
                                onChange("foundedYear", e.target.value)
                            }
                            error={errors.foundedYear}
                            placeholder="e.g., 2020"
                            helperText="1800 - 2100"
                            min={1800}
                            max={2100}
                            fullWidth
                        />
                    </div>
                    <Input
                        label="Website URL"
                        value={formData.websiteUrl}
                        onChange={(e) => onChange("websiteUrl", e.target.value)}
                        error={errors.websiteUrl}
                        placeholder="https://example.com"
                        helperText="Max 512 characters"
                        fullWidth
                    />
                    <Input
                        label="LinkedIn URL"
                        value={formData.linkedinUrl}
                        onChange={(e) =>
                            onChange("linkedinUrl", e.target.value)
                        }
                        error={errors.linkedinUrl}
                        placeholder="https://linkedin.com/company/your-company"
                        helperText="Must be a valid LinkedIn company or profile URL"
                        fullWidth
                    />
                </div>

                <div className="flex gap-3 justify-end mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        isLoading={isSaving}
                        disabled={hasErrors}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </HeadlessModal>
    );
};

interface EditAboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: {
        aboutUs: string;
        whoWeSeek: string;
    };
    onChange: (field: keyof CompanyProfileFormData, value: string) => void;
    onSave: () => Promise<void>;
    isSaving: boolean;
}

const EditAboutModal: React.FC<EditAboutModalProps> = ({
    isOpen,
    onClose,
    formData,
    onChange,
    onSave,
    isSaving,
}) => {
    // Validation errors state
    const errors = useMemo(
        () => ({
            aboutUs: companyValidators.aboutUs(formData.aboutUs),
            whoWeSeek: companyValidators.whoWeSeek(formData.whoWeSeek),
        }),
        [formData]
    );

    const hasErrors = Object.values(errors).some(Boolean);

    const handleSave = async () => {
        if (hasErrors) return;
        await onSave();
        onClose();
    };

    return (
        <HeadlessModal
            isOpen={isOpen}
            onClose={onClose}
            overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Edit About
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <Textarea
                            label="About Us"
                            value={formData.aboutUs}
                            onChange={(e) =>
                                onChange("aboutUs", e.target.value)
                            }
                            error={errors.aboutUs}
                            rows={5}
                            placeholder="Tell candidates about your company culture..."
                            fullWidth
                        />
                        <div className="flex justify-end mt-1">
                            <span
                                className={`text-xs ${formData.aboutUs.length > 10000 ? "text-red-500" : "text-gray-400"}`}
                            >
                                {formData.aboutUs.length}/10000
                            </span>
                        </div>
                    </div>
                    <div>
                        <Textarea
                            label="Who We Seek"
                            value={formData.whoWeSeek}
                            onChange={(e) =>
                                onChange("whoWeSeek", e.target.value)
                            }
                            error={errors.whoWeSeek}
                            rows={5}
                            placeholder="Describe the type of candidates you're looking for..."
                            fullWidth
                        />
                        <div className="flex justify-end mt-1">
                            <span
                                className={`text-xs ${formData.whoWeSeek.length > 5000 ? "text-red-500" : "text-gray-400"}`}
                            >
                                {formData.whoWeSeek.length}/5000
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        isLoading={isSaving}
                        disabled={hasErrors}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </HeadlessModal>
    );
};

// Main Component
export const CompanyInfoForm: React.FC = () => {
    const {
        formData,
        profile,
        isLoading,
        isSaving,
        error,
        successMessage,
        handleChange,
        handleSubmitCompany,
        handleSubmitProfile,
        handleLogoUpload,
        handleBannerUpload,
    } = useCompanyInfoForm();

    // Modal states
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

    // Modal handlers
    const openCompanyModal = useCallback(() => setIsCompanyModalOpen(true), []);
    const closeCompanyModal = useCallback(
        () => setIsCompanyModalOpen(false),
        []
    );
    const openProfileModal = useCallback(() => setIsProfileModalOpen(true), []);
    const closeProfileModal = useCallback(
        () => setIsProfileModalOpen(false),
        []
    );
    const openAboutModal = useCallback(() => setIsAboutModalOpen(true), []);
    const closeAboutModal = useCallback(() => setIsAboutModalOpen(false), []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    const hasLinks = formData.websiteUrl || formData.linkedinUrl;
    const hasAddress = formData.streetAddress || formData.city;

    return (
        <div className="space-y-6">
            {/* Alerts */}
            {error && (
                <Alert type="error" onClose={() => {}}>
                    {error}
                </Alert>
            )}
            {successMessage && (
                <Alert type="success" onClose={() => {}}>
                    {successMessage}
                </Alert>
            )}

            {/* Banner with Logo */}
            <BannerWithLogo
                bannerUrl={profile?.bannerUrl}
                logoUrl={profile?.logoUrl}
                companyName={formData.name}
                onBannerUpload={handleBannerUpload}
                onLogoUpload={handleLogoUpload}
            />

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Sidebar: Metadata */}
                <div className="space-y-6">
                    {/* At a Glance Card */}
                    <InfoCard
                        title="At a Glance"
                        action={
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={openProfileModal}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                        }
                    >
                        <div className="space-y-4">
                            <LabeledValue
                                icon={<Briefcase className="w-full h-full" />}
                                label="Industry"
                                value={formData.industry}
                            />
                            <LabeledValue
                                icon={<Users className="w-full h-full" />}
                                label="Company Size"
                                value={
                                    formData.companySize
                                        ? `${formData.companySize} Employees`
                                        : undefined
                                }
                            />
                            <LabeledValue
                                icon={<Calendar className="w-full h-full" />}
                                label="Founded"
                                value={formData.foundedYear}
                            />
                        </div>
                    </InfoCard>

                    {/* Connect Card */}
                    <InfoCard title="Connect" variant="subtle">
                        {hasLinks && (
                            <div className="flex gap-3 mb-4">
                                {formData.websiteUrl && (
                                    <SocialLink
                                        href={formData.websiteUrl}
                                        icon={<Globe />}
                                        label="Website"
                                    />
                                )}
                                {formData.linkedinUrl && (
                                    <SocialLink
                                        href={formData.linkedinUrl}
                                        icon={<Linkedin />}
                                        label="LinkedIn"
                                    />
                                )}
                            </div>
                        )}
                        {hasAddress && (
                            <div className="flex items-start gap-2 text-sm text-gray-500">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                    {formData.streetAddress && (
                                        <p>{formData.streetAddress}</p>
                                    )}
                                    <p>
                                        {[formData.city, formData.countryCode]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>
                                </div>
                            </div>
                        )}
                        {formData.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                                <Phone className="w-4 h-4" />
                                <span>{formData.phone}</span>
                            </div>
                        )}
                        {!hasLinks && !hasAddress && !formData.phone && (
                            <p className="text-sm text-gray-400 italic">
                                No contact information added yet.
                            </p>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={openCompanyModal}
                            className="mt-4 w-full"
                        >
                            <span className="flex items-center justify-center gap-1">
                                <Pencil className="w-4 h-4" />
                                Edit Contact Info
                            </span>
                        </Button>
                    </InfoCard>
                </div>

                {/* Right Content: Narrative */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="relative group">
                        {/* Edit button for About section */}
                        <button
                            onClick={openAboutModal}
                            className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-gray-100 hover:bg-gray-200 rounded-full z-10"
                        >
                            <Pencil className="w-4 h-4 text-gray-600" />
                        </button>

                        {/* About Us Section */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                About Us
                            </h2>
                            {formData.aboutUs ? (
                                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                    {formData.aboutUs}
                                </p>
                            ) : (
                                <p className="text-gray-400 italic text-lg">
                                    Tell candidates about your company, culture,
                                    and what makes you unique...
                                </p>
                            )}
                        </section>

                        <div className="border-t border-gray-100 my-8" />

                        {/* Who We Seek Section */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Who We Seek
                            </h2>
                            <InfoCard variant="accent" padding="md">
                                {formData.whoWeSeek ? (
                                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                        {formData.whoWeSeek}
                                    </p>
                                ) : (
                                    <p className="text-slate-400 italic">
                                        Describe the type of candidates you're
                                        looking for...
                                    </p>
                                )}
                            </InfoCard>
                        </section>
                    </div>
                </div>
            </div>

            {/* Edit Modals */}
            <EditCompanyModal
                isOpen={isCompanyModalOpen}
                onClose={closeCompanyModal}
                formData={{
                    name: formData.name,
                    phone: formData.phone,
                    streetAddress: formData.streetAddress,
                    city: formData.city,
                    countryCode: formData.countryCode,
                }}
                onChange={handleChange}
                onSave={handleSubmitCompany}
                isSaving={isSaving}
            />

            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={closeProfileModal}
                formData={{
                    industry: formData.industry,
                    companySize: formData.companySize,
                    foundedYear: formData.foundedYear,
                    websiteUrl: formData.websiteUrl,
                    linkedinUrl: formData.linkedinUrl,
                }}
                onChange={handleChange}
                onSave={handleSubmitProfile}
                isSaving={isSaving}
            />

            <EditAboutModal
                isOpen={isAboutModalOpen}
                onClose={closeAboutModal}
                formData={{
                    aboutUs: formData.aboutUs,
                    whoWeSeek: formData.whoWeSeek,
                }}
                onChange={handleChange}
                onSave={handleSubmitProfile}
                isSaving={isSaving}
            />
        </div>
    );
};

export default CompanyInfoForm;
