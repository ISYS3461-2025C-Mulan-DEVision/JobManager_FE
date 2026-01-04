import React from "react";
import { Input } from "@/components/ui";
import { JobPostFormData, JobPostFormErrors } from "../types";
import { EMPLOYMENT_TYPES, EMPLOYMENT_TYPE_LABELS } from "@/utils/constants";
import { EmploymentType } from "@/types";
import clsx from "clsx";

interface Step1BasicsProps {
    formData: JobPostFormData;
    errors: JobPostFormErrors;
    onChange: (field: keyof JobPostFormData, value: any) => void;
}

export const Step1Basics: React.FC<Step1BasicsProps> = ({
    formData,
    errors,
    onChange,
}) => {
    const toggleEmploymentType = (type: EmploymentType) => {
        const current = formData.employmentTypes;
        const updated = current.includes(type)
            ? current.filter((t) => t !== type)
            : [...current, type];

        onChange("employmentTypes", updated);
    };

    return (
        <div className="space-y-6">
            {/* Job Title */}
            <Input
                label="Job Title *"
                type="text"
                placeholder="e.g., Senior Full-Stack Developer"
                value={formData.title}
                onChange={(e) => onChange("title", e.target.value)}
                error={errors.title}
                fullWidth
            />

            {/* Employment Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Employment Type *
                </label>
                <div className="space-y-3">
                    {(
                        Object.keys(EMPLOYMENT_TYPES) as Array<
                            keyof typeof EMPLOYMENT_TYPES
                        >
                    ).map((key) => {
                        const type = EMPLOYMENT_TYPES[key];
                        const isSelected =
                            formData.employmentTypes.includes(type);

                        const isInternship =
                            type === EMPLOYMENT_TYPES.INTERNSHIP;
                        const isContract = type === EMPLOYMENT_TYPES.CONTRACT;
                        const hasOtherTypes = formData.employmentTypes.some(
                            (t) =>
                                t !== EMPLOYMENT_TYPES.INTERNSHIP &&
                                t !== EMPLOYMENT_TYPES.CONTRACT
                        );

                        // Disable logic:
                        // - If Internship/Contract is selected, disable Full-time/Part-time
                        // - If Full-time/Part-time is selected, disable all others
                        let isDisabled = false;
                        if (isInternship || isContract) {
                            // Disable if Full-time or Part-time is already selected
                            isDisabled = hasOtherTypes;
                        } else {
                            // Disable Full-time/Part-time if:
                            // 1. Any type is already selected, OR
                            // 2. Internship or Contract is selected
                            isDisabled =
                                formData.employmentTypes.length > 0 &&
                                !isSelected;
                        }

                        return (
                            <label
                                key={type}
                                className={clsx(
                                    "flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all",
                                    isSelected
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300",
                                    isDisabled &&
                                        "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleEmploymentType(type)}
                                    disabled={isDisabled}
                                    className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                    <span
                                        className={clsx(
                                            "font-medium",
                                            isSelected
                                                ? "text-blue-700"
                                                : "text-gray-900"
                                        )}
                                    >
                                        {EMPLOYMENT_TYPE_LABELS[type]}
                                    </span>
                                    {isDisabled && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Only Internship and Contract can be
                                            combined together
                                        </p>
                                    )}
                                    {(type === EMPLOYMENT_TYPES.INTERNSHIP ||
                                        type === EMPLOYMENT_TYPES.CONTRACT) &&
                                        !hasOtherTypes && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Can only be combined with each
                                                other
                                            </p>
                                        )}
                                </div>
                            </label>
                        );
                    })}
                </div>
                {errors.employmentTypes && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.employmentTypes}
                    </p>
                )}
            </div>

            {/* Fresher Friendly */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                    type="checkbox"
                    id="isFresher"
                    checked={formData.isFresher}
                    onChange={(e) => onChange("isFresher", e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="isFresher" className="flex-1 cursor-pointer">
                    <span className="font-medium text-gray-900">
                        Fresher Friendly
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                        This position is suitable for candidates with little to
                        no work experience
                    </p>
                </label>
            </div>
        </div>
    );
};
