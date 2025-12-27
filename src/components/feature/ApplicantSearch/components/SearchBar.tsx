import React from "react";
import { Input } from "@/components/ui";
import { APPLICANT_SORT_OPTIONS, APPLICANT_SORT_LABELS } from "@/utils/constants";
import type { ApplicantSortOption } from "../types";

interface SearchBarProps {
    keyword: string;
    sortBy: ApplicantSortOption;
    onKeywordChange: (keyword: string) => void;
    onSortChange: (sortBy: ApplicantSortOption) => void;
    onSearch: () => void;
    disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    keyword,
    sortBy,
    onKeywordChange,
    onSortChange,
    onSearch,
    disabled = false,
}) => {
    const sortOptions = Object.entries(APPLICANT_SORT_OPTIONS).map(([, value]) => ({
        value,
        label: APPLICANT_SORT_LABELS[value],
    }));

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch();
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full sm:max-w-md">
                <Input
                    type="text"
                    value={keyword}
                    onChange={(e) => onKeywordChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search by skills, experience, or summary..."
                    disabled={disabled}
                    fullWidth
                    endAdornment={
                        <button
                            onClick={onSearch}
                            disabled={disabled}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            aria-label="Search"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    }
                />
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 flex-wrap">
                {sortOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onSortChange(option.value as ApplicantSortOption)}
                        disabled={disabled}
                        className={`px-3 py-1.5 text-sm rounded-full transition-colors cursor-pointer ${
                            sortBy === option.value
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {option.label}
                        {sortBy === option.value && (
                            <svg
                                className="inline w-4 h-4 ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
