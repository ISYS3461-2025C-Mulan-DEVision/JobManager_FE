import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spinner } from "@/components/ui";
import {
    JobPostFormData,
    JobPostFormErrors,
    FormStep,
    FORM_STEPS,
    SaveStatus,
} from "./types";
import {
    validateBasics,
    validateCompensation,
    validateDescription,
    validateVisibility,
    validateAllSteps,
} from "./validation";
import { Step1Basics } from "./steps/Step1Basics";
import { Step2Compensation } from "./steps/Step2Compensation";
import { Step3Description } from "./steps/Step3Description";
import { Step4Visibility } from "./steps/Step4Visibility";
import { JobPostPreviewModal } from "./components/JobPostPreviewModal";
import { ROUTES } from "@/utils/constants";
import clsx from "clsx";
import {
    createJobPost,
    publishJobPost,
    fetchJobPostById,
    updateJobPost,
} from "@/services/jobPostService";
import { getCompanyId } from "@/services/authStorage";
import { CreateJobPostRequest, UpdateJobPostRequest, JobPost } from "@/types";

const CreateJobPostPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);

    // Form state
    const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.BASICS);
    const [formData, setFormData] = useState<JobPostFormData>({
        title: "",
        employmentTypes: [],
        isFresher: false,
        salaryType: "" as any,
        salaryMin: "",
        salaryMax: "",
        salaryNote: "",
        locationCity: "",
        countryCode: "",
        description: "",
        technicalSkills: [],
		selectedSkills: [],
        isPrivate: false,
        expiryAt: "",
        isPublished: false,
    });
    const [errors, setErrors] = useState<JobPostFormErrors>({});
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Auto-save draft every 30 seconds
    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (saveStatus !== "saving") {
                handleAutoSave();
            }
        }, 30000); // 30 seconds

        return () => clearInterval(autoSaveInterval);
    }, [formData, saveStatus]);

    // Load existing job post if editing
    useEffect(() => {
        if (isEditMode && id) {
            loadJobPost(id);
        }
    }, [id, isEditMode]);

    /**
     * Convert JobPost API response to form data format
     */
    const convertJobPostToFormData = (jobPost: JobPost): JobPostFormData => {
        // Extract date part from ISO datetime string (e.g., "2026-01-09T23:59:59" -> "2026-01-09")
        const expiryDate = jobPost.expiryAt
            ? jobPost.expiryAt.split("T")[0]
            : "";

        return {
            title: jobPost.title,
            employmentTypes: jobPost.employmentType
                ? [jobPost.employmentType]
                : [],
            isFresher: jobPost.isFresher,
            salaryType: jobPost.salaryType,
            salaryMin:
                jobPost.salaryMin !== null ? jobPost.salaryMin.toString() : "",
            salaryMax:
                jobPost.salaryMax !== null ? jobPost.salaryMax.toString() : "",
            salaryNote: jobPost.salaryNote || "",
            locationCity: jobPost.locationCity,
            description: jobPost.description,
			countryCode: jobPost.countryCode || "",
            // TODO: Fetch actual skill names from skill service using jobPost.skillIds
            // For now, skills will be lost on edit until skill service integration is complete
            technicalSkills: [],
            isPrivate: jobPost.isPrivate,
            expiryAt: expiryDate,
            isPublished: jobPost.isPublished,
        };
    };

    const loadJobPost = async (jobId: string) => {
        setIsLoading(true);
        try {
            const jobPost = await fetchJobPostById(jobId);
            const formData = convertJobPostToFormData(jobPost);
            setFormData(formData);
        } catch (error: any) {
            console.error("Failed to load job post:", error);
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load job post. Please try again.";
            alert(errorMessage);
            // Navigate back to job posts page on error
            navigate(ROUTES.JOB_POSTS);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Convert form data to API request format
     */
    const convertFormDataToRequest = (
        data: JobPostFormData
    ): CreateJobPostRequest => {
        const companyId = getCompanyId();
        if (!companyId) {
            throw new Error("Company ID not found. Please log in again.");
        }

        // Convert date string to ISO 8601 datetime (end of day)
        // Input: "2026-01-09" -> Output: "2026-01-09T23:59:59"
        const expiryAtDateTime = data.expiryAt
            ? `${data.expiryAt}T23:59:59`
            : data.expiryAt;

        // TODO: Convert technicalSkills (names) to skillIds (UUIDs) using skill service
        // Currently, skills are not being sent to the backend
        // Need to integrate with skill service to map skill names to IDs

		// Extract skill IDs from selected skills
		const skillIds = data.selectedSkills?.map(skill => skill.id) || [];

        return {
            companyId,
            title: data.title,
            description: data.description,
            locationCity: data.locationCity,
			countryCode: data.countryCode || undefined,
            salaryType: data.salaryType,
            salaryMin: data.salaryMin ? parseFloat(data.salaryMin) : undefined,
            salaryMax: data.salaryMax ? parseFloat(data.salaryMax) : undefined,
            salaryNote: data.salaryNote || undefined,
            isFresher: data.isFresher,
            isPrivate: data.isPrivate,
            expiryAt: expiryAtDateTime,
            employmentType:
                data.employmentTypes.length > 0
                    ? data.employmentTypes[0]
                    : undefined,
            skillIds: skillIds, // TODO: Map technicalSkills to skillIds
        };
    };

    const handleAutoSave = useCallback(async () => {
        // Only auto-save if form has content
        if (!formData.title && formData.technicalSkills.length === 0) {
            return;
        }

        setSaveStatus("saving");

        try {
            // TODO: Call API to save draft
            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

            setSaveStatus("saved");
            setLastSavedAt(new Date());

            // Reset to idle after 2 seconds
            setTimeout(() => {
                setSaveStatus("idle");
            }, 2000);
        } catch (error) {
            console.error("Auto-save failed:", error);
            setSaveStatus("error");
        }
    }, [formData]);

    const handleFieldChange = (field: keyof JobPostFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error for this field
        if (errors[field as keyof JobPostFormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const validateCurrentStep = (): boolean => {
        let stepErrors: JobPostFormErrors = {};

        switch (currentStep) {
            case FormStep.BASICS:
                stepErrors = validateBasics(formData);
                break;
            case FormStep.COMPENSATION:
                stepErrors = validateCompensation(formData);
                break;
            case FormStep.DESCRIPTION:
                stepErrors = validateDescription(formData);
                break;
            case FormStep.VISIBILITY:
                stepErrors = validateVisibility(formData);
                break;
        }

        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length - 1));
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleStepClick = (step: FormStep) => {
        // Allow navigating to previous steps or current step freely
        if (step <= currentStep) {
            setCurrentStep(step);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            // Validate current step before moving forward
            if (validateCurrentStep()) {
                setCurrentStep(step);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };

    const handleSaveDraft = async () => {
        setIsSubmitting(true);
        setSaveStatus("saving");

        try {
            if (isEditMode && id) {
                // Update existing job post
                const updateData: UpdateJobPostRequest = {
                    title: formData.title,
                    description: formData.description,
                    locationCity: formData.locationCity,
					countryCode: formData.countryCode || undefined,
                    salaryType: formData.salaryType,
                    salaryMin: formData.salaryMin
                        ? parseFloat(formData.salaryMin)
                        : undefined,
                    salaryMax: formData.salaryMax
                        ? parseFloat(formData.salaryMax)
                        : undefined,
                    salaryNote: formData.salaryNote || undefined,
                    isFresher: formData.isFresher,
                    isPrivate: formData.isPrivate,
                    expiryAt: formData.expiryAt
                        ? `${formData.expiryAt}T23:59:59`
                        : undefined,
					skillIds: formData.selectedSkills?.map(skill => skill.id) || [],
                };
                await updateJobPost(id, updateData);
                alert("Job post updated successfully!");
            } else {
                // Create new job post
                const requestData = convertFormDataToRequest(formData);
                await createJobPost(requestData);
                alert("Draft saved successfully!");
            }

            setSaveStatus("saved");
            setLastSavedAt(new Date());

            // Navigate back to job posts
            setTimeout(() => {
                navigate(ROUTES.JOB_POSTS);
            }, 500);
        } catch (error: any) {
            console.error("Failed to save draft:", error);
            setSaveStatus("error");
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to save draft. Please try again.";
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePublish = async () => {
        // Validate all steps
        const allErrors = validateAllSteps(formData);
        setErrors(allErrors);

        if (Object.keys(allErrors).length > 0) {
            alert("Please fix all errors before publishing");
            return;
        }

        setIsSubmitting(true);
        setSaveStatus("saving");

        try {
            if (isEditMode && id) {
                // Update existing job post and publish
                const updateData: UpdateJobPostRequest = {
                    title: formData.title,
                    description: formData.description,
                    locationCity: formData.locationCity,
					countryCode: formData.countryCode || undefined,
                    salaryType: formData.salaryType,
                    salaryMin: formData.salaryMin
                        ? parseFloat(formData.salaryMin)
                        : undefined,
                    salaryMax: formData.salaryMax
                        ? parseFloat(formData.salaryMax)
                        : undefined,
                    salaryNote: formData.salaryNote || undefined,
                    isFresher: formData.isFresher,
                    isPrivate: formData.isPrivate,
                    expiryAt: formData.expiryAt
                        ? `${formData.expiryAt}T23:59:59`
                        : undefined,
					skillIds: formData.selectedSkills?.map(skill => skill.id) || [],
                };
                await updateJobPost(id, updateData);

                // Publish the updated job post
                await publishJobPost(id);
                alert("Job post updated and published successfully! 🎉");
            } else {
                // Create new job post and publish
                const requestData = convertFormDataToRequest(formData);
                const createdJobPost = await createJobPost(requestData);

                // Then immediately publish it
                await publishJobPost(createdJobPost.id);
                alert("Job post published successfully! 🎉");
            }

            setSaveStatus("saved");

            // Navigate back to job posts
            navigate(ROUTES.JOB_POSTS);
        } catch (error: any) {
            console.error("Failed to publish:", error);
            setSaveStatus("error");
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to publish job post. Please try again.";
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case FormStep.BASICS:
                return (
                    <Step1Basics
                        formData={formData}
                        errors={errors}
                        onChange={handleFieldChange}
                    />
                );
            case FormStep.COMPENSATION:
                return (
                    <Step2Compensation
                        formData={formData}
                        errors={errors}
                        onChange={handleFieldChange}
                    />
                );
            case FormStep.DESCRIPTION:
                return (
                    <Step3Description
                        formData={formData}
                        errors={errors}
                        onChange={handleFieldChange}
                    />
                );
            case FormStep.VISIBILITY:
                return (
                    <Step4Visibility
                        formData={formData}
                        errors={errors}
                        onChange={handleFieldChange}
                        onSaveDraft={handleSaveDraft}
                        onPublish={handlePublish}
                        isSaving={isSubmitting}
                        showPreview={() => setShowPreview(true)}
                    />
                );
            default:
                return null;
        }
    };

    const getSaveStatusIndicator = () => {
        switch (saveStatus) {
            case "saving":
                return (
                    <span className="text-sm text-gray-500 flex items-center gap-2">
                        <Spinner className="w-4 h-4" />
                        Saving...
                    </span>
                );
            case "saved":
                return (
                    <span className="text-sm text-green-600 flex items-center gap-2">
                        ✓ Saved
                        {lastSavedAt && (
                            <span className="text-gray-500">
                                at {lastSavedAt.toLocaleTimeString()}
                            </span>
                        )}
                    </span>
                );
            case "error":
                return (
                    <span className="text-sm text-red-600 flex items-center gap-2">
                        ⚠ Failed to save
                    </span>
                );
            default:
                return lastSavedAt ? (
                    <span className="text-sm text-gray-500">
                        Last saved at {lastSavedAt.toLocaleTimeString()}
                    </span>
                ) : null;
        }
    };

    // Show loading spinner while fetching job post data
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Spinner className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-gray-600">Loading job post...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isEditMode
                                    ? "Edit Job Post"
                                    : "Create New Job Post"}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Fill in the details to post your job
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {getSaveStatusIndicator()}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(ROUTES.JOB_POSTS)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>

                    {/* Progress Stepper */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between">
                            {FORM_STEPS.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    <button
                                        onClick={() => handleStepClick(step.id)}
                                        className={clsx(
                                            "flex items-center gap-3 transition-all",
                                            step.id <= currentStep
                                                ? "cursor-pointer"
                                                : "cursor-not-allowed opacity-50"
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                                                step.id === currentStep
                                                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                                    : step.id < currentStep
                                                      ? "bg-green-500 text-white"
                                                      : "bg-gray-200 text-gray-500"
                                            )}
                                        >
                                            {step.id < currentStep ? (
                                                "✓"
                                            ) : (
                                                <span>{index + 1}</span>
                                            )}
                                        </div>
                                        <div className="hidden sm:block text-left">
                                            <div
                                                className={clsx(
                                                    "text-sm font-medium",
                                                    step.id === currentStep
                                                        ? "text-blue-600"
                                                        : step.id < currentStep
                                                          ? "text-green-600"
                                                          : "text-gray-500"
                                                )}
                                            >
                                                {step.label}
                                            </div>
                                        </div>
                                    </button>

                                    {index < FORM_STEPS.length - 1 && (
                                        <div
                                            className={clsx(
                                                "flex-1 h-1 mx-2 rounded transition-all",
                                                step.id < currentStep
                                                    ? "bg-green-500"
                                                    : "bg-gray-200"
                                            )}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        {FORM_STEPS[currentStep].title}
                    </h2>

                    {renderStep()}

                    {/* Navigation Buttons (for steps 1-3) */}
                    {currentStep < FormStep.VISIBILITY && (
                        <div className="flex justify-between mt-8 pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentStep === FormStep.BASICS}
                            >
                                ← Previous
                            </Button>

                            <Button variant="primary" onClick={handleNext}>
                                Next →
                            </Button>
                        </div>
                    )}

                    {/* Step 4 has its own action buttons */}
                </div>

                {/* Helper Tips */}
                {currentStep === FormStep.BASICS && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            💡 <strong>Pro tip:</strong> Be specific with your
                            job title to attract the right candidates. Use
                            common industry terms.
                        </p>
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            <JobPostPreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                formData={formData}
            />
        </div>
    );
};

export default CreateJobPostPage;
