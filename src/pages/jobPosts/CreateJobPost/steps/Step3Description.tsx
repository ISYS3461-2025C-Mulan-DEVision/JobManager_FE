import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui";
import { JobPostFormData, JobPostFormErrors } from "../types";
import clsx from "clsx";

interface Step3DescriptionProps {
    formData: JobPostFormData;
    errors: JobPostFormErrors;
    onChange: (field: keyof JobPostFormData, value: any) => void;
}

// Common technical skills for autocomplete
const COMMON_SKILLS = [
    "JavaScript",
    "TypeScript",
    "React",
    "Vue.js",
    "Angular",
    "Node.js",
    "Python",
    "Java",
    "Spring Boot",
    "C#",
    ".NET",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "SQL",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "Git",
    "CI/CD",
    "Agile",
    "Scrum",
];

export const Step3Description: React.FC<Step3DescriptionProps> = ({
    formData,
    errors,
    onChange,
}) => {
    const [skillInput, setSkillInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
    const skillInputRef = useRef<HTMLInputElement>(null);

    const handleSkillInputChange = (value: string) => {
        setSkillInput(value);

        if (value.trim().length > 0) {
            const filtered = COMMON_SKILLS.filter(
                (skill) =>
                    skill.toLowerCase().includes(value.toLowerCase()) &&
                    !formData.technicalSkills.includes(skill)
            );
            setFilteredSkills(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const addSkill = (skill: string) => {
        const trimmedSkill = skill.trim();
        if (trimmedSkill && !formData.technicalSkills.includes(trimmedSkill)) {
            onChange("technicalSkills", [
                ...formData.technicalSkills,
                trimmedSkill,
            ]);
            setSkillInput("");
            setShowSuggestions(false);
            skillInputRef.current?.focus();
        }
    };

    const removeSkill = (skillToRemove: string) => {
        onChange(
            "technicalSkills",
            formData.technicalSkills.filter((skill) => skill !== skillToRemove)
        );
    };

    const handleSkillInputKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill(skillInput);
        } else if (
            e.key === "Backspace" &&
            skillInput === "" &&
            formData.technicalSkills.length > 0
        ) {
            // Remove last skill if input is empty
            const newSkills = [...formData.technicalSkills];
            newSkills.pop();
            onChange("technicalSkills", newSkills);
        }
    };

    const characterCount = formData.description.length;
    const maxCharacters = 10000;
    const isNearLimit = characterCount > maxCharacters * 0.9;

    return (
        <div className="space-y-6">
            {/* Job Description */}
            <div>
                <Textarea
                    label="Job Description *"
                    placeholder="Describe the role, responsibilities, requirements, and what makes this position exciting..."
                    value={formData.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    error={errors.description}
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
                            isNearLimit ? "text-red-600" : "text-gray-500"
                        )}
                    >
                        {characterCount.toLocaleString()} /{" "}
                        {maxCharacters.toLocaleString()}
                    </span>
                </div>

                {/* Rich Text Tips */}
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-2">
                        💡 Tips for a great job description:
                    </p>
                    <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                        <li>
                            Start with an engaging overview of the role and your
                            company
                        </li>
                        <li>List key responsibilities clearly</li>
                        <li>
                            Specify required and preferred qualifications
                            separately
                        </li>
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
                        {formData.technicalSkills.map((skill) => (
                            <span
                                key={skill}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                            >
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => removeSkill(skill)}
                                    className="hover:text-blue-900 focus:outline-none"
                                >
                                    ×
                                </button>
                            </span>
                        ))}

                        {/* Input */}
                        <input
                            ref={skillInputRef}
                            type="text"
                            value={skillInput}
                            onChange={(e) =>
                                handleSkillInputChange(e.target.value)
                            }
                            onKeyDown={handleSkillInputKeyDown}
                            onBlur={() =>
                                setTimeout(() => setShowSuggestions(false), 200)
                            }
                            onFocus={() => {
                                if (
                                    skillInput.trim().length > 0 &&
                                    filteredSkills.length > 0
                                ) {
                                    setShowSuggestions(true);
                                }
                            }}
                            placeholder={
                                formData.technicalSkills.length === 0
                                    ? "Type a skill and press Enter..."
                                    : "Add more..."
                            }
                            className="flex-1 min-w-[200px] outline-none bg-transparent"
                        />
                    </div>

                    {/* Autocomplete Suggestions */}
                    {showSuggestions && filteredSkills.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filteredSkills.map((skill) => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => addSkill(skill)}
                                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm transition-colors"
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {errors.technicalSkills && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.technicalSkills}
                    </p>
                )}

                <p className="mt-2 text-xs text-gray-500">
                    Press Enter to add a skill, or select from suggestions.
                    Free-text skills are allowed.
                </p>

                {/* Quick Add Popular Skills */}
                {formData.technicalSkills.length === 0 && (
                    <div className="mt-3">
                        <p className="text-xs text-gray-600 mb-2">
                            Popular skills:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {COMMON_SKILLS.slice(0, 8).map((skill) => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => addSkill(skill)}
                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                >
                                    + {skill}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
