import React, { useState, useCallback, useEffect } from "react";
import {
    Filters,
    SavedSearchProfiles,
    SearchBar,
    ApplicantList,
    ApplicantDetailsModal,
} from "@/components/feature/ApplicantSearch/components";
import {
    useApplicantSearch,
    useSearchProfiles,
    useSubscription,
} from "@/components/feature/ApplicantSearch/hooks";
import type {
    Applicant,
    SearchState,
    UpdateSearchProfileRequest,
} from "@/components/feature/ApplicantSearch/types";

export const ApplicantSearchPage: React.FC = () => {
    // Hooks
    const {
        searchState,
        applicants,
        totalElements,
        totalPages,
        isLoading: isSearching,
        error: searchError,
        updateSearchState,
        setSearchState,
        search,
        goToPage,
    } = useApplicantSearch();

    const {
        profiles,
        selectedProfile,
        isSaving,
        selectProfile,
        createProfile,
        updateProfile,
        deleteProfile,
    } = useSearchProfiles();

    const { isPremium } = useSubscription();

    // Local state
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Load selected profile's filters when profile changes
    useEffect(() => {
        if (selectedProfile) {
            const newState: SearchState = {
                ...searchState,
                countryCode: selectedProfile.countryCode,
                employmentTypes: selectedProfile.employmentTypes,
                highestDegree: selectedProfile.highestDegree,
                minSalary: selectedProfile.minSalary,
                maxSalary: selectedProfile.maxSalary,
                skillIds: selectedProfile.skillIds,
                page: 0, // Reset to first page when loading profile
            };
            setSearchState(newState);
        }
    }, [selectedProfile?.id]);

    // Handlers
    const handleSearch = useCallback(() => {
        // Reset to first page when searching
        updateSearchState({ page: 0 });
        search();
    }, [updateSearchState, search]);

    const handleFilterChange = useCallback(
        (updates: Partial<SearchState>) => {
            updateSearchState(updates);
        },
        [updateSearchState]
    );

    const handleSaveAsNew = useCallback(
        async (name: string) => {
            await createProfile(name, searchState);
        },
        [createProfile, searchState]
    );

    const handleSaveChanges = useCallback(async () => {
        if (!selectedProfile) return;

        const updates: UpdateSearchProfileRequest = {
            profileName: selectedProfile.profileName,
            countryCode: searchState.countryCode,
            employmentTypes: searchState.employmentTypes,
            highestDegree: searchState.highestDegree,
            minSalary: searchState.minSalary,
            maxSalary: searchState.maxSalary,
            skillIds: searchState.skillIds,
        };

        await updateProfile(selectedProfile.id, updates);
    }, [selectedProfile, searchState, updateProfile]);

    const handleDelete = useCallback(async () => {
        if (!selectedProfile) return;
        await deleteProfile(selectedProfile.id);
    }, [selectedProfile, deleteProfile]);

    const handleApplicantClick = useCallback((applicant: Applicant) => {
        setSelectedApplicant(applicant);
        setIsDetailsModalOpen(true);
    }, []);

    const handleCloseDetailsModal = useCallback(() => {
        setIsDetailsModalOpen(false);
        setSelectedApplicant(null);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Applicant Search
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Search and filter applicants to find the perfect candidates
                    </p>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <SearchBar
                        keyword={searchState.keyword}
                        sortBy={searchState.sortBy}
                        onKeywordChange={(keyword) => updateSearchState({ keyword })}
                        onSortChange={(sortBy) => updateSearchState({ sortBy })}
                        onSearch={handleSearch}
                        disabled={isSearching}
                    />
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Sidebar - Saved Profiles & Filters */}
                    <aside className="lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4 space-y-6">
                            {/* Saved Search Profiles */}
                            <SavedSearchProfiles
                                profiles={profiles}
                                selectedProfile={selectedProfile}
                                isPremium={isPremium}
                                isSaving={isSaving}
                                searchState={searchState}
                                onSelectProfile={selectProfile}
                                onSaveAsNew={handleSaveAsNew}
                                onSaveChanges={handleSaveChanges}
                                onDelete={handleDelete}
                            />

                            <hr className="border-gray-200" />

                            {/* Filters */}
                            <Filters
                                searchState={searchState}
                                onFilterChange={handleFilterChange}
                                onSearch={handleSearch}
                                disabled={isSearching}
                            />
                        </div>
                    </aside>

                    {/* Right Content - Applicant List */}
                    <main className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <ApplicantList
                                applicants={applicants}
                                isLoading={isSearching}
                                error={searchError}
                                currentPage={searchState.page}
                                totalPages={totalPages}
                                totalElements={totalElements}
                                pageSize={searchState.pageSize}
                                onPageChange={goToPage}
                                onApplicantClick={handleApplicantClick}
                            />
                        </div>
                    </main>
                </div>
            </div>

            {/* Applicant Details Modal */}
            <ApplicantDetailsModal
                applicant={selectedApplicant}
                isOpen={isDetailsModalOpen}
                onClose={handleCloseDetailsModal}
            />
        </div>
    );
};

export default ApplicantSearchPage;
