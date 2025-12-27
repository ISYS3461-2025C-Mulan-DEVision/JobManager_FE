import React from "react";
import { Badge, Card, Button } from "@/components/ui";
import { EMPLOYMENT_TYPE_LABELS, EDUCATION_DEGREE_LABELS } from "@/utils/constants";
import type { Applicant } from "../types";

interface ApplicantCardProps {
    applicant: Applicant;
    onClick: () => void;
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({
    applicant,
    onClick,
}) => {
    // TODO: Mark as Warning/Favorite feature - not implemented yet
    // const isFavorite = applicant.isFavorite;
    // const isWarning = applicant.isWarning;

    const formatSalary = (min?: number, max?: number): string => {
        if (!min && !max) return "Not specified";
        if (min && max) return `$${min.toLocaleString()}-$${max.toLocaleString()}`;
        if (min) return `From $${min.toLocaleString()}`;
        if (max) return `Up to $${max.toLocaleString()}`;
        return "Not specified";
    };

    return (
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer relative">
            {/* TODO: Warning/Favorite indicators */}
            {/* {isFavorite && (
                <span className="absolute top-2 right-2 text-yellow-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </span>
            )}
            {isWarning && (
                <span className="absolute top-2 right-10 text-red-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </span>
            )} */}

            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {applicant.avatarUrl ? (
                        <img
                            src={applicant.avatarUrl}
                            alt={applicant.fullName}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mb-2">
                        {applicant.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill.id} variant="info">
                                {skill.name}
                            </Badge>
                        ))}
                        {applicant.skills.length > 3 && (
                            <Badge variant="neutral">
                                +{applicant.skills.length - 3}
                            </Badge>
                        )}
                    </div>

                    {/* Name & Email */}
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {applicant.fullName}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{applicant.email}</p>

                    {/* Details */}
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        {applicant.highestDegree && (
                            <span className="flex items-center gap-1">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 14l9-5-9-5-9 5 9 5z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                                    />
                                </svg>
                                {EDUCATION_DEGREE_LABELS[applicant.highestDegree]}
                            </span>
                        )}
                        {applicant.employmentType && (
                            <span className="flex items-center gap-1">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {EMPLOYMENT_TYPE_LABELS[applicant.employmentType]}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {formatSalary(applicant.minSalary, applicant.maxSalary)}
                        </span>
                        {applicant.countryCode && (
                            <span className="flex items-center gap-1">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                {applicant.countryCode}
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                    <Button variant="primary" size="sm" onClick={onClick}>
                        Applicant Details
                    </Button>
                </div>
            </div>
        </Card>
    );
};
