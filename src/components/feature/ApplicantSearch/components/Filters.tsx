import React, { useState, useEffect } from "react";
import { Select, Checkbox, RangeSlider, TagInput } from "@/components/ui";
import type { Tag } from "@/components/ui/TagInput";
import {
    EMPLOYMENT_TYPES,
    EMPLOYMENT_TYPE_LABELS,
    EDUCATION_DEGREES,
    EDUCATION_DEGREE_LABELS,
} from "@/utils/constants";
import type { SearchState, Country, EducationDegree, EmploymentType } from "../types";
import ApplicantSearchService from "../api/ApplicantSearchService";

interface FiltersProps {
    searchState: SearchState;
    onFilterChange: (updates: Partial<SearchState>) => void;
    onSearch?: () => void;
    disabled?: boolean;
}

// TODO: Skills list should come from backend API
// For now, using mock data
const MOCK_SKILLS: Tag[] = [
    { id: "1", name: "MongoDB" },
    { id: "2", name: "Kafka" },
    { id: "3", name: "Full Stack" },
    { id: "4", name: "Backend" },
    { id: "5", name: "Frontend" },
    { id: "6", name: "React" },
    { id: "7", name: "Node.js" },
    { id: "8", name: "Python" },
    { id: "9", name: "Java" },
    { id: "10", name: "TypeScript" },
];

export const Filters: React.FC<FiltersProps> = ({
    searchState,
    onFilterChange,
    // onSearch prop is available for future use if needed
    disabled = false,
}) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);
    const [localMinSalary, setLocalMinSalary] = useState(searchState.minSalary || 0);
    const [localMaxSalary, setLocalMaxSalary] = useState(searchState.maxSalary || 10000);

    // Load countries on mount
    useEffect(() => {
        const loadCountries = async () => {
            try {
                const response = await ApplicantSearchService.getCountries();
                if (response.success && response.data) {
                    setCountries(response.data);
                }
            } catch (err) {
                console.error("Failed to load countries:", err);
            } finally {
                setIsLoadingCountries(false);
            }
        };
        loadCountries();
    }, []);

    // Update local salary values when searchState changes
    useEffect(() => {
        setLocalMinSalary(searchState.minSalary || 0);
        setLocalMaxSalary(searchState.maxSalary || 10000);
    }, [searchState.minSalary, searchState.maxSalary]);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onFilterChange({ countryCode: value || undefined });
    };

    const handleEmploymentTypeChange = (type: EmploymentType, checked: boolean) => {
        const newTypes = checked
            ? [...searchState.employmentTypes, type]
            : searchState.employmentTypes.filter((t) => t !== type);
        onFilterChange({ employmentTypes: newTypes });
    };

    const handleDegreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as EducationDegree;
        onFilterChange({
            highestDegree: searchState.highestDegree === value ? undefined : value,
        });
    };

    const handleSalaryApply = () => {
        onFilterChange({
            minSalary: localMinSalary,
            maxSalary: localMaxSalary,
        });
    };

    const handleSkillAdd = (skillId: string) => {
        onFilterChange({ skillIds: [...searchState.skillIds, skillId] });
    };

    const handleSkillRemove = (skillId: string) => {
        onFilterChange({
            skillIds: searchState.skillIds.filter((id) => id !== skillId),
        });
    };

    const countryOptions = [
        { value: "", label: "Choose country" },
        ...countries.map((c) => ({ value: c.code, label: c.displayName })),
    ];

    return (
        <div className="space-y-6">
            {/* Location */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Location</h3>
                <Select
                    options={countryOptions}
                    value={searchState.countryCode || ""}
                    onChange={handleCountryChange}
                    disabled={disabled || isLoadingCountries}
                    fullWidth
                />
            </div>

            {/* Employment Type */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Employment Type
                </h3>
                <div className="space-y-2">
                    {Object.entries(EMPLOYMENT_TYPES).map(([key, value]) => (
                        <Checkbox
                            key={key}
                            label={EMPLOYMENT_TYPE_LABELS[value]}
                            checked={searchState.employmentTypes.includes(value as EmploymentType)}
                            onChange={(e) =>
                                handleEmploymentTypeChange(
                                    value as EmploymentType,
                                    e.target.checked
                                )
                            }
                            disabled={disabled}
                        />
                    ))}
                </div>
            </div>

            {/* Education Degree */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Education Degree
                </h3>
                <div className="space-y-2">
                    {Object.entries(EDUCATION_DEGREES).map(([key, value]) => (
                        <label
                            key={key}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                value={value}
                                checked={searchState.highestDegree === value}
                                onChange={handleDegreeChange}
                                disabled={disabled}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                                {EDUCATION_DEGREE_LABELS[value]}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Salary Range */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Salary</h3>
                <RangeSlider
                    min={0}
                    max={10000}
                    step={100}
                    minValue={localMinSalary}
                    maxValue={localMaxSalary}
                    onMinChange={setLocalMinSalary}
                    onMaxChange={setLocalMaxSalary}
                    onApply={handleSalaryApply}
                    formatValue={(v) => v.toLocaleString()}
                />
            </div>

            {/* Skill Tags */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Skill Tags</h3>
                <TagInput
                    tags={MOCK_SKILLS}
                    selectedTags={searchState.skillIds}
                    onTagAdd={handleSkillAdd}
                    onTagRemove={handleSkillRemove}
                    placeholder="Search for skills"
                    disabled={disabled}
                />
            </div>
        </div>
    );
};
