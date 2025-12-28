import { useState, useCallback, useEffect } from "react";
import ApplicantSearchService from "../api/ApplicantSearchService";
import { MOCK_APPLICANTS } from "../data/mockApplicants";
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
    // Search state
    const [searchState, setSearchStateInternal] = useState<SearchState>(defaultSearchState);

    // Results state
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Update search state partially
    const updateSearchState = useCallback((updates: Partial<SearchState>) => {
        setSearchStateInternal((prev) => ({
            ...prev,
            ...updates,
            // Reset to page 0 when filters change (except when only page changes)
            page: updates.page !== undefined ? updates.page : 0,
        }));
    }, []);

    // Set entire search state
    const setSearchState = useCallback((state: SearchState) => {
        setSearchStateInternal(state);
    }, []);

    // Reset search state
    const resetSearchState = useCallback(() => {
        setSearchStateInternal(defaultSearchState);
    }, []);

    // Go to specific page
    const goToPage = useCallback((page: number) => {
        setSearchStateInternal((prev) => ({
            ...prev,
            page,
        }));
    }, []);

    // Search function
    const search = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // TODO: Replace with actual API call when backend is ready
            // const response = await ApplicantSearchService.searchApplicants(searchState);
            // if (response.success && response.data) {
            //     setApplicants(response.data.content);
            //     setTotalElements(response.data.totalElements);
            //     setTotalPages(response.data.totalPages);
            // } else {
            //     setError(response.message || "Search failed");
            // }

            // Mock implementation for UI testing
            await new Promise((resolve) => setTimeout(resolve, 300));

            // Apply filters to mock data
            let filteredApplicants = [...MOCK_APPLICANTS];

            // Filter by keyword (search in name, email, bio, skills)
            if (searchState.keyword) {
                const keyword = searchState.keyword.toLowerCase();
                filteredApplicants = filteredApplicants.filter(
                    (a) =>
                        a.fullName.toLowerCase().includes(keyword) ||
                        a.email.toLowerCase().includes(keyword) ||
                        a.bio?.toLowerCase().includes(keyword) ||
                        a.skills.some((s) =>
                            s.name.toLowerCase().includes(keyword)
                        )
                );
            }

            // Filter by country
            if (searchState.countryCode) {
                filteredApplicants = filteredApplicants.filter(
                    (a) => a.countryCode === searchState.countryCode
                );
            }

            // Filter by employment types (now checks array intersection)
            if (searchState.employmentTypes.length > 0) {
                filteredApplicants = filteredApplicants.filter(
                    (a) => a.employmentTypes.some(type => searchState.employmentTypes.includes(type))
                );
            }

            // Sort applicants based on sortBy option
            switch (searchState.sortBy) {
                case "newest":
                    // Sort by createdAt descending (newest first)
                    filteredApplicants.sort((a, b) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    break;
                case "salaryAsc":
                    // Sort by desired salary ascending (lowest first)
                    filteredApplicants.sort((a, b) => {
                        const salaryA = a.desiredSalary ?? 0;
                        const salaryB = b.desiredSalary ?? 0;
                        return salaryA - salaryB;
                    });
                    break;
                case "salaryDesc":
                    // Sort by desired salary descending (highest first)
                    filteredApplicants.sort((a, b) => {
                        const salaryA = a.desiredSalary ?? 0;
                        const salaryB = b.desiredSalary ?? 0;
                        return salaryB - salaryA;
                    });
                    break;
                case "isFresher":
                    // Sort by fresher status (FRESHER and INTERNSHIP first, then by newest)
                    filteredApplicants.sort((a, b) => {
                        const isFresherA = a.employmentTypes.includes("FRESHER") || a.employmentTypes.includes("INTERNSHIP") ? 1 : 0;
                        const isFresherB = b.employmentTypes.includes("FRESHER") || b.employmentTypes.includes("INTERNSHIP") ? 1 : 0;
                        
                        if (isFresherA !== isFresherB) {
                            return isFresherB - isFresherA; // Freshers first
                        }
                        // If both are freshers or both are not, sort by newest
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    });
                    break;
                default:
                    // Default to newest
                    filteredApplicants.sort((a, b) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
            }

            // Calculate pagination
            const totalElements = filteredApplicants.length;
            const totalPages = Math.ceil(totalElements / searchState.pageSize);
            const startIndex = searchState.page * searchState.pageSize;
            const paginatedApplicants = filteredApplicants.slice(
                startIndex,
                startIndex + searchState.pageSize
            );

            setApplicants(paginatedApplicants);
            setTotalElements(totalElements);
            setTotalPages(totalPages);
        } catch (err) {
            setError("Failed to search applicants");
            console.error("Search error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [searchState]);

    // Auto-search when page, sort, or filters change
    useEffect(() => {
        search();
    }, [
        searchState.page,
        searchState.sortBy,
        searchState.countryCode,
        searchState.employmentTypes,
        searchState.highestDegree,
        searchState.minSalary,
        searchState.maxSalary,
        searchState.skillIds,
    ]);

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
