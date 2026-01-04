import React from "react";
import { Input } from "@/components/ui";
import {
  APPLICANT_SORT_OPTIONS,
  APPLICANT_SORT_LABELS,
} from "@/utils/constants";
import { Search, Check } from "lucide-react";
import type { ApplicantSortOption } from "../types";

interface SearchBarProps {
  /** Search term (username/name search) */
  searchTerm: string;
  sortBy: ApplicantSortOption;
  onSearchTermChange: (term: string) => void;
  onSortChange: (sortBy: ApplicantSortOption) => void;
  onSearch: () => void;
  disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  sortBy,
  onSearchTermChange,
  onSortChange,
  onSearch,
  disabled = false,
}) => {
  const sortOptions = Object.entries(APPLICANT_SORT_OPTIONS).map(
    ([, value]) => ({
      value,
      label: APPLICANT_SORT_LABELS[value],
    }),
  );

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
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by name..."
          disabled={disabled}
          fullWidth
          endAdornment={
            <button
              onClick={onSearch}
              disabled={disabled}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
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
              <Check className="inline w-4 h-4 ml-1" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
