import React, { useState, useEffect } from "react";
import { Input, Select } from "@/components/ui";
import { JobPostFormData, JobPostFormErrors } from "../types";
import { SALARY_TYPES, SALARY_TYPE_LABELS } from "@/utils/constants";
import { SalaryType } from "@/types";
import httpClient from "@/services/httpClient";

interface Step2CompensationProps {
    formData: JobPostFormData;
    errors: JobPostFormErrors;
    onChange: (field: keyof JobPostFormData, value: any) => void;
}

export const Step2Compensation: React.FC<Step2CompensationProps> = ({
    formData,
    errors,
    onChange,
}) => {
    const [showSalaryNote, setShowSalaryNote] = useState(false);
    const [countryList, setCountryList] = useState<
        Array<{ code: string; displayName: string }>
    >([]);
    const [countryLoading, setCountryLoading] = useState(true);
    const [countryError, setCountryError] = useState<string | null>(null);

    // Fetch countries from API
    useEffect(() => {
        let isMounted = true;
        setCountryLoading(true);
        setCountryError(null);

        httpClient
            .get("/auth/countries")
            .then((res: any) => {
                if (isMounted) {
                    setCountryList(res.data.data || []);
                    setCountryLoading(false);
                }
            })
            .catch((err: any) => {
                if (isMounted) {
                    setCountryError("Failed to load country list");
                    setCountryLoading(false);
                    console.error("Error fetching countries:", err);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        // Auto-show salary note if type is NEGOTIABLE
        if (formData.salaryType === SALARY_TYPES.NEGOTIABLE) {
            setShowSalaryNote(true);
        }
    }, [formData.salaryType]);

    const salaryTypeOptions = [
        { value: "", label: "Select salary type" },
        ...Object.keys(SALARY_TYPES).map((key) => ({
            value: SALARY_TYPES[key as keyof typeof SALARY_TYPES],
            label: SALARY_TYPE_LABELS[
                SALARY_TYPES[key as keyof typeof SALARY_TYPES]
            ],
        })),
    ];

    const renderSalaryInputs = () => {
        const type = formData.salaryType as SalaryType;

        if (!type) return null;

        switch (type) {
            case SALARY_TYPES.RANGE:
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Minimum Salary *"
                            type="number"
                            placeholder="50000"
                            value={formData.salaryMin}
                            onChange={(value) =>
                                onChange("salaryMin", value)
                            }
                            error={errors.salaryMin}
                            fullWidth
                        />
                        <Input
                            label="Maximum Salary *"
                            type="number"
                            placeholder="80000"
                            value={formData.salaryMax}
                            onChange={(value) =>
                                onChange("salaryMax", value)
                            }
                            error={errors.salaryMax}
                            fullWidth
                        />
                    </div>
                );

            case SALARY_TYPES.ABOUT:
                return (
                    <Input
                        label="Estimated Salary *"
                        type="number"
                        placeholder="60000"
                        value={formData.salaryMin}
                        onChange={(value) => onChange("salaryMin", value)}
                        error={errors.salaryMin}
                        helperText="An approximate salary amount"
                        fullWidth
                    />
                );

            case SALARY_TYPES.UP_TO:
                return (
                    <Input
                        label="Maximum Salary *"
                        type="number"
                        placeholder="100000"
                        value={formData.salaryMax}
                        onChange={(value) => onChange("salaryMax", value)}
                        error={errors.salaryMax}
                        helperText="The highest salary offered"
                        fullWidth
                    />
                );

            case SALARY_TYPES.FROM:
                return (
                    <Input
                        label="Starting Salary *"
                        type="number"
                        placeholder="50000"
                        value={formData.salaryMin}
                        onChange={(value) => onChange("salaryMin", value)}
                        error={errors.salaryMin}
                        helperText="Minimum salary, with potential for more"
                        fullWidth
                    />
                );

            case SALARY_TYPES.NEGOTIABLE:
                return (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            Salary will be discussed during the interview
                            process.
                        </p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Salary Type Selector */}
            <Select
                label="Salary Type *"
                options={salaryTypeOptions}
                value={formData.salaryType}
                onChange={(e) =>
                    onChange("salaryType", e.target.value as SalaryType)
                }
                error={errors.salaryType}
                fullWidth
            />

            {/* Dynamic Salary Inputs */}
            {renderSalaryInputs()}

            {/* Optional Salary Note */}
            {formData.salaryType && (
                <div>
                    {!showSalaryNote ? (
                        <button
                            type="button"
                            onClick={() => setShowSalaryNote(true)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            + Add salary note (optional)
                        </button>
                    ) : (
                        <Input
                            label="Salary Note (Optional)"
                            type="text"
                            placeholder="e.g., Plus performance bonuses, equity options"
                            value={formData.salaryNote}
                            onChange={(value) =>
                                onChange("salaryNote", value)
                            }
                            helperText="Additional compensation details"
                            fullWidth
                        />
                    )}
                </div>
            )}

            {/* Location */}
            <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Location
                </h3>

                <div className="space-y-4">
                    <Select
                        label="Country *"
                        options={[
                            { value: "", label: "Select a country" },
                            ...countryList.map((country) => ({
                                value: country.code,
                                label: country.displayName,
                            })),
                        ]}
                        // value={formData.countryId}
                        // onChange={(e) => onChange("countryId", e.target.value)}
                        // error={errors.countryId || countryError || undefined}
                        disabled={countryLoading}
                        fullWidth
                    />

                    <Input
                        label="City *"
                        type="text"
                        placeholder="e.g., Ho Chi Minh City"
                        value={formData.locationCity}
                        onChange={(value) =>
                            onChange("locationCity", value)
                        }
                        error={errors.locationCity}
                        fullWidth
                    />

                    {countryLoading && (
                        <p className="text-sm text-gray-500">
                            Loading countries...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
