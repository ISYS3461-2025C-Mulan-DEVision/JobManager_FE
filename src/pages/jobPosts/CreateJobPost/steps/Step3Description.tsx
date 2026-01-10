import React from "react";
import { Textarea } from "@/components/ui";
import { JobPostFormData, JobPostFormErrors } from "../types";
import { useDescriptionStep } from "../hooks";
import clsx from "clsx";

// ============================================================================
// Types
// ============================================================================

interface Step3DescriptionProps {
    formData: JobPostFormData;
    errors: JobPostFormErrors;
    onChange: (field: keyof JobPostFormData, value: any) => void;
}

// ============================================================================
// Sub-Components (UI Layer)
// ============================================================================

interface SkillChipProps {
    skill: string;
    onRemove: () => void;
}

const SkillChip: React.FC<SkillChipProps> = ({ skill, onRemove }) => (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
        {skill}
        <button
            type="button"
            onClick={onRemove}
            className="hover:text-blue-900 focus:outline-none"
        >
            ×
        </button>
    </span>
);

interface SuggestionListProps {
    suggestions: string[];
    onSelect: (skill: string) => void;
}

const SuggestionList: React.FC<SuggestionListProps> = ({ suggestions, onSelect }) => (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
        {suggestions.map((skill) => (
            <button
                key={skill}
                type="button"
                onClick={() => onSelect(skill)}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm transition-colors"
            >
                {skill}
            </button>
        ))}
    </div>
);

interface PopularSkillsProps {
    skills: string[];
    onSelect: (skill: string) => void;
}

const PopularSkills: React.FC<PopularSkillsProps> = ({ skills, onSelect }) => (
    <div className="mt-3">
        <p className="text-xs text-gray-600 mb-2">Popular skills:</p>
        <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
                <button
                    key={skill}
                    type="button"
                    onClick={() => onSelect(skill)}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                    + {skill}
                </button>
            ))}
        </div>
    </div>
);

// ============================================================================
// Main Component
// ============================================================================

export const Step3Description: React.FC<Step3DescriptionProps> = (props) => {
    // Use headless hook for all logic
    const { description, skills } = useDescriptionStep(props);

    return (
        <div className="space-y-6">
            {/* Job Description */}
            <div>
                <Textarea
                    label="Job Description *"
                    placeholder="Describe the role, responsibilities, requirements, and what makes this position exciting..."
                    value={description.value}
                    onChange={(e) => description.onChange(e.target.value)}
                    error={description.error}
                    rows={10}
                    fullWidth
                />
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                        Minimum 50 characters for better clarity
                    </span>
                    <span
                        className={clsx(
                            "text-xs",
                            description.isNearLimit ? "text-red-600" : "text-gray-500"
                        )}
                    >
                        {description.characterCount.toLocaleString()} /{" "}
                        {description.maxCharacters.toLocaleString()}
                    </span>
                </div>

                {/* Rich Text Tips */}
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-2">
                        💡 Tips for a great job description:
                    </p>
                    <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                        <li>Start with an engaging overview of the role and your company</li>
                        <li>List key responsibilities clearly</li>
                        <li>Specify required and preferred qualifications separately</li>
                        <li>Highlight what makes your company unique</li>
                        <li>Mention benefits and growth opportunities</li>
                    </ul>
                </div>
            </div>

            {/* Technical Skills */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technical Skills *
                </label>

                {/* Skills Input with Autocomplete */}
                <div className="relative">
                    <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition-colors min-h-[48px]">
                        {/* Skill Chips */}
                        {skills.items.map((skill) => (
                            <SkillChip
                                key={skill}
                                skill={skill}
                                onRemove={() => skills.remove(skill)}
                            />
                        ))}

                        {/* Input */}
                        <input
                            ref={skills.inputRef}
                            type="text"
                            value={skills.inputValue}
                            onChange={(e) => skills.handleInputChange(e.target.value)}
                            onKeyDown={skills.handleKeyDown}
                            onBlur={skills.handleInputBlur}
                            onFocus={skills.handleInputFocus}
                            placeholder={
                                skills.items.length === 0
                                    ? "Type a skill and press Enter..."
                                    : "Add more..."
                            }
                            className="flex-1 min-w-[200px] outline-none bg-transparent"
                        />
                    </div>

                    {/* Autocomplete Suggestions */}
                    {skills.suggestions.isVisible && (
                        <SuggestionList
                            suggestions={skills.suggestions.items}
                            onSelect={skills.add}
                        />
                    )}
                </div>

                {skills.error && (
                    <p className="mt-2 text-sm text-red-600">{skills.error}</p>
                )}

                <p className="mt-2 text-xs text-gray-500">
                    Press Enter to add a skill, or select from suggestions. Free-text skills are allowed.
                </p>

                {/* Quick Add Popular Skills */}
                {skills.items.length === 0 && (
                    <PopularSkills
                        skills={skills.popularSkills}
                        onSelect={skills.add}
                    />
                )}
            </div>
        </div>
    );
};
