import React from "react";
import { Input, Button } from "@/components/ui";
import { JobPostFormData, JobPostFormErrors } from "../types";
import clsx from "clsx";

interface Step4VisibilityProps {
    formData: JobPostFormData;
    errors: JobPostFormErrors;
    onChange: (field: keyof JobPostFormData, value: any) => void;
    onSaveDraft: () => void;
    onPublish: () => void;
    isSaving: boolean;
    showPreview: () => void;
}

export const Step4Visibility: React.FC<Step4VisibilityProps> = ({
    formData,
    errors,
    onChange,
    onSaveDraft,
    onPublish,
    isSaving,
    showPreview,
}) => {
    // Calculate default expiry date (30 days from now)
    const getDefaultExpiryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date.toISOString().split("T")[0];
    };

    // Calculate min date (tomorrow)
    const getMinDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().split("T")[0];
    };

    return (
        <div className="space-y-6">
            {/* Visibility Toggle */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Visibility
                </label>

                <div className="space-y-3">
                    {/* Public Option */}
                    <label
                        className={clsx(
                            "flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all",
                            !formData.isPrivate
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                        )}
                    >
                        <input
                            type="radio"
                            name="visibility"
                            checked={!formData.isPrivate}
                            onChange={() => onChange("isPrivate", false)}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span
                                    className={clsx(
                                        "font-medium",
                                        !formData.isPrivate
                                            ? "text-blue-700"
                                            : "text-gray-900"
                                    )}
                                >
                                    🌐 Public
                                </span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    Recommended
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                Visible to all job seekers and search engines.
                                Maximum reach.
                            </p>
                        </div>
                    </label>

                    {/* Private Option */}
                    <label
                        className={clsx(
                            "flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all",
                            formData.isPrivate
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                        )}
                    >
                        <input
                            type="radio"
                            name="visibility"
                            checked={formData.isPrivate}
                            onChange={() => onChange("isPrivate", true)}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                            <span
                                className={clsx(
                                    "font-medium",
                                    formData.isPrivate
                                        ? "text-blue-700"
                                        : "text-gray-900"
                                )}
                            >
                                🔒 Private
                            </span>
                            <p className="text-sm text-gray-600 mt-1">
                                Only accessible via direct link. Not searchable.
                            </p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Expiry Date */}
            <div>
                <Input
                    label="Expiry Date (Optional)"
                    type="date"
                    value={formData.expiryAt}
                    onChange={(e) => onChange("expiryAt", e.target.value)}
                    error={errors.expiryAt}
                    min={getMinDate()}
                    helperText="Job post will automatically close after this date"
                    fullWidth
                />

                {!formData.expiryAt && (
                    <button
                        type="button"
                        onClick={() =>
                            onChange("expiryAt", getDefaultExpiryDate())
                        }
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Set default (30 days from now)
                    </button>
                )}
            </div>

            {/* Preview Summary */}
            <div className="border-t pt-6 mt-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        📋 Ready to Publish?
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Job Title:</span>
                            <span className="font-medium text-gray-900">
                                {formData.title || "Not set"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Employment Types:
                            </span>
                            <span className="font-medium text-gray-900">
                                {formData.employmentTypes.length || "None"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Location:</span>
                            <span className="font-medium text-gray-900">
                                {formData.locationCity || "Not set"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Skills:</span>
                            <span className="font-medium text-gray-900">
                                {formData.selectedSkills?.length || 0} added
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Visibility:</span>
                            <span className="font-medium text-gray-900">
                                {formData.isPrivate
                                    ? "🔒 Private"
                                    : "🌐 Public"}
                            </span>
                        </div>
                    </div>

                    {/* Preview Button */}
                    <button
                        type="button"
                        onClick={showPreview}
                        className="mt-4 w-full py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                    >
                        👁️ Preview Job Post
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 mt-6">
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onSaveDraft}
                        disabled={isSaving}
                        className="flex-1"
                        size="lg"
                    >
                        💾 Save as Draft
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onPublish}
                        isLoading={isSaving}
                        className="flex-1"
                        size="lg"
                    >
                        🚀 Publish Job Post
                    </Button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-3">
                    You can always edit or unpublish this job post later
                </p>
            </div>
        </div>
    );
};
