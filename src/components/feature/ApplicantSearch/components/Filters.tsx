import React, { useState, useEffect } from "react";
import {
  Select,
  Checkbox,
  // TODO: Uncomment when JA adds salary support
  // RangeSlider,
  TagInput,
  RadioGroup,
  Toggle,
} from "@/components/ui";
import type { RadioOption } from "@/components/ui";
import type { Tag } from "@/components/ui/TagInput";
import {
  EMPLOYMENT_TYPES,
  EMPLOYMENT_TYPE_LABELS,
  EDUCATION_DEGREES,
  EDUCATION_DEGREE_LABELS,
} from "@/utils/constants";
import type {
  SearchState,
  Country,
  EducationDegree,
  EmploymentType,
} from "../types";
import ApplicantSearchService from "../api/ApplicantSearchService";

interface FiltersProps {
  searchState: SearchState;
  onFilterChange: (updates: Partial<SearchState>) => void;
  onSearch?: () => void;
  disabled?: boolean;
  // Search profile props
  selectedProfileId?: string;
  isProfileActive?: boolean;
  onProfileStatusChange?: (isActive: boolean) => void;
  isUpdatingStatus?: boolean;
}

export const Filters: React.FC<FiltersProps> = ({
  searchState,
  onFilterChange,
  // onSearch prop is available for future use if needed
  disabled = false,
  selectedProfileId,
  isProfileActive = false,
  onProfileStatusChange,
  isUpdatingStatus = false,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [skills, setSkills] = useState<Tag[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);

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

  // Load skills on mount
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await ApplicantSearchService.getSkills();
        if (response.success && response.data) {
          // Map API response to Tag format expected by TagInput
          const mappedSkills: Tag[] = response.data.map((skill) => ({
            id: skill.id,
            name: skill.name,
          }));
          setSkills(mappedSkills);
        }
      } catch (err) {
        console.error("Failed to load skills:", err);
      } finally {
        setIsLoadingSkills(false);
      }
    };
    loadSkills();
  }, []);

  const handleCountryChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    onFilterChange({ countryCode: value || undefined });
  };

  const handleEmploymentTypeChange = (
    type: EmploymentType,
    checked: boolean,
  ) => {
    const newTypes = checked
      ? [...searchState.employmentTypes, type]
      : searchState.employmentTypes.filter((t) => t !== type);
    onFilterChange({ employmentTypes: newTypes });
  };

  const handleDegreeChange = (value: string | undefined) => {
    onFilterChange({ education: value as EducationDegree | undefined });
  };

  // TODO: Salary filtering - uncomment when JA adds salary support
  // const handleSalaryMinChange = (value: number) => {
  //   onFilterChange({ minSalary: value });
  // };
  //
  // const handleSalaryMaxChange = (value: number) => {
  //   onFilterChange({ maxSalary: value });
  // };

  const handleSkillAdd = (skillId: string) => {
    onFilterChange({ skillIds: [...searchState.skillIds, skillId] });
  };

  const handleSkillRemove = (skillId: string) => {
    onFilterChange({
      skillIds: searchState.skillIds.filter((id) => id !== skillId),
    });
  };

  const handleProfileStatusToggle = (checked: boolean) => {
    onProfileStatusChange?.(checked);
  };

  const countryOptions = [
    { value: "", label: "All countries" },
    ...countries
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
      .map((c) => ({ value: c.code, label: c.displayName })),
  ];

  const educationDegreeOptions: RadioOption[] = Object.entries(
    EDUCATION_DEGREES,
  ).map(([, value]) => ({
    value: value,
    label: EDUCATION_DEGREE_LABELS[value],
  }));

  return (
    <div className="space-y-6">
      {/* Search Profile Status Toggle - only show when a profile is selected */}
      {selectedProfileId && (
        <div className="pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Profile Status
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {isProfileActive ? "Active" : "Inactive"}
              </p>
            </div>
            <Toggle
              checked={isProfileActive}
              onChange={handleProfileStatusToggle}
              disabled={disabled || isUpdatingStatus}
              size="md"
            />
          </div>
        </div>
      )}

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
              checked={searchState.employmentTypes.includes(
                value as EmploymentType,
              )}
              onChange={(e) =>
                handleEmploymentTypeChange(
                  value as EmploymentType,
                  e.target.checked,
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
        <RadioGroup
          name="education-degree"
          options={educationDegreeOptions}
          value={searchState.education}
          onChange={handleDegreeChange}
          disabled={disabled}
          allowDeselect
        />
      </div>

      {/* TODO: Salary Range - JA does not have salary fields yet */}
      {/* Uncomment when JA adds salary support to UserResponse */}
      {/*
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Salary</h3>
        <RangeSlider
          min={0}
          max={10000}
          step={100}
          minGap={100}
          minValue={searchState.minSalary ?? 0}
          maxValue={searchState.maxSalary ?? 10000}
          onMinChange={handleSalaryMinChange}
          onMaxChange={handleSalaryMaxChange}
          formatValue={(v) => v.toLocaleString()}
        />
      </div>
      */}

      {/* Skill Tags */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Skill Tags</h3>
        <TagInput
          tags={skills}
          selectedTags={searchState.skillIds}
          onTagAdd={handleSkillAdd}
          onTagRemove={handleSkillRemove}
          placeholder="Search for skills"
          disabled={disabled || isLoadingSkills}
        />
      </div>
    </div>
  );
};
