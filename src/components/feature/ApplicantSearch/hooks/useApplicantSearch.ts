import { useState, useCallback, useEffect } from "react";
import ApplicantSearchService from "../api/ApplicantSearchService";
import type {
    SearchState,
    Applicant,
} from "../types";

// Default search state
const defaultSearchState: SearchState = {
    keyword: "",
    countryCode: undefined,
    employmentTypes: [],
    highestDegree: undefined,
    minSalary: undefined,
    maxSalary: undefined,
    skillIds: [],
    sortBy: "newest",
    page: 0,
    pageSize: 10,
};

interface UseApplicantSearchReturn {
    // State
    searchState: SearchState;
    applicants: Applicant[];
    totalElements: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    updateSearchState: (updates: Partial<SearchState>) => void;
    setSearchState: (state: SearchState) => void;
    resetSearchState: () => void;
    search: () => Promise<void>;
    goToPage: (page: number) => void;
}

export const useApplicantSearch = (): UseApplicantSearchReturn => {
    const [searchState, setSearchState] = useState<SearchState>(defaultSearchState);
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateSearchState = useCallback((updates: Partial<SearchState>) => {
        setSearchState((prev) => ({ ...prev, ...updates }));
    }, []);

    const resetSearchState = useCallback(() => {
        setSearchState(defaultSearchState);
    }, []);

    const search = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // TODO: Search endpoint not finalized - applicant list will always be empty
            // This will be implemented when backend applicant attributes are finalized
            const response = await ApplicantSearchService.searchApplicants(searchState);
            if (response.success && response.data) {
                setApplicants(response.data.content);
                setTotalElements(response.data.totalElements);
                setTotalPages(response.data.totalPages);
            } else {
                // Handle case where search returns no results or fails gracefully
                setApplicants([]);
                setTotalElements(0);
                setTotalPages(0);
            }
        } catch (err) {
            // TODO: Backend not fully implemented yet - gracefully handle errors
            console.warn("Applicant search failed (expected - backend not fully implemented):", err);
            setApplicants([]);
            setTotalElements(0);
            setTotalPages(0);
            // Don't show error to user since this is expected behavior
            // setError(err instanceof Error ? err.message : "Failed to search applicants");
        } finally {
            setIsLoading(false);
        }
    }, [searchState]);

    const goToPage = useCallback((page: number) => {
        setSearchState((prev) => ({ ...prev, page }));
    }, []);

    // Auto-search when page changes
    useEffect(() => {
        search();
    }, [searchState.page]);

    return {
        searchState,
        applicants,
        totalElements,
        totalPages,
        isLoading,
        error,
        updateSearchState,
        setSearchState,
        resetSearchState,
        search,
        goToPage,
    };
};
