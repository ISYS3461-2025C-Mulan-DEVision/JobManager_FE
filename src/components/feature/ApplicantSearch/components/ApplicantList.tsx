import React from "react";
import { Spinner } from "@/components/ui";
import { Pagination } from "@/components/ui";
import { ApplicantCard } from "./ApplicantCard";
import type { Applicant } from "../types";

interface ApplicantListProps {
    applicants: Applicant[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onApplicantClick: (applicant: Applicant) => void;
}

export const ApplicantList: React.FC<ApplicantListProps> = ({
    applicants,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    onPageChange,
    onApplicantClick,
}) => {
    // Calculate display range
    const startItem = currentPage * pageSize + 1;
    const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg
                    className="w-12 h-12 text-red-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error loading applicants
                </h3>
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    if (applicants.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg
                    className="w-16 h-16 text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No applicants found
                </h3>
                <p className="text-gray-500 max-w-md">
                    Try adjusting your search filters or search terms to find more
                    applicants.
                </p>
                {/* TODO: Applicant search backend not fully implemented yet */}
                <p className="text-sm text-gray-400 mt-4 italic">
                    Note: Applicant data is still being finalized. Results will appear once the backend is fully implemented.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Results count */}
            <p className="text-sm text-gray-600">
                Showing {startItem}-{endItem} of {totalElements} results
            </p>

            {/* Applicant cards */}
            <div className="space-y-4">
                {applicants.map((applicant) => (
                    <ApplicantCard
                        key={applicant.id}
                        applicant={applicant}
                        onClick={() => onApplicantClick(applicant)}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pt-4">
                    <Pagination
                        currentPage={currentPage + 1} // Convert 0-indexed to 1-indexed
                        totalPages={totalPages}
                        onPageChange={(page) => onPageChange(page - 1)} // Convert back to 0-indexed
                    />
                </div>
            )}
        </div>
    );
};
