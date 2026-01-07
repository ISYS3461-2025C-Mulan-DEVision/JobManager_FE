import React from "react";
import { Spinner } from "@/components/ui";
import { Pagination } from "@/components/ui";
import { ApplicantCard } from "./ApplicantCard";
import { AlertTriangle, Users } from "lucide-react";
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
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
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
        <Users className="w-16 h-16 text-gray-300 mb-4" strokeWidth={1.5} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No applicants found
        </h3>
        <p className="text-gray-500 max-w-md">
          Try adjusting your search filters or search terms to find more
          applicants.
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
