import React from "react";
import { HeadlessModal } from "@/components/headless";
import { Badge } from "@/components/ui";
import { EDUCATION_DEGREE_LABELS } from "@/utils/constants";
import type { Applicant } from "../types";

interface ApplicantDetailsModalProps {
    applicant: Applicant | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ApplicantDetailsModal: React.FC<ApplicantDetailsModalProps> = ({
    applicant,
    isOpen,
    onClose,
}) => {
    if (!applicant) return null;

    // TODO: Mark as Warning/Favorite feature - not implemented yet

    return (
        <HeadlessModal
            isOpen={isOpen}
            onClose={onClose}
            overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Applicant Details</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close"
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
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <div className="p-6">
                {/* Header Section */}
                <div className="flex items-start gap-6 mb-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        {applicant.avatarUrl ? (
                            <img
                                src={applicant.avatarUrl}
                                alt={applicant.fullName}
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg
                                    className="w-12 h-12 text-gray-400"
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

                    {/* Basic Info */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {applicant.fullName}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
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
                                    </svg>
                                    {EDUCATION_DEGREE_LABELS[applicant.highestDegree]}
                                </span>
                            )}
                            {applicant.highestDegree && applicant.countryCode && (
                                <span>•</span>
                            )}
                            {applicant.countryCode && (
                                <span>{applicant.countryCode}</span>
                            )}
                        </div>

                        {/* TODO: Mark as dropdown - not implemented yet */}
                        {/* <div className="mt-3">
                            <select className="px-3 py-1.5 border rounded-lg text-sm">
                                <option>Mark as...</option>
                                <option>Favorite</option>
                                <option>Warning</option>
                            </select>
                        </div> */}
                    </div>

                    {/* Contact Info */}
                    <div className="flex-shrink-0 text-right">
                        <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                        {applicant.phone && (
                            <p className="flex items-center justify-end gap-2 text-sm text-gray-600">
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
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                {applicant.phone}
                                <button className="p-1 hover:bg-gray-100 rounded">
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
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                </button>
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Bio, Education, Work Experience */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Bio */}
                        {applicant.bio && (
                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Bio
                                </h3>
                                <p className="text-gray-600 whitespace-pre-wrap">
                                    {applicant.bio}
                                </p>
                            </section>
                        )}

                        {/* Education */}
                        {applicant.education.length > 0 && (
                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Education
                                </h3>
                                <div className="space-y-4">
                                    {applicant.education.map((edu) => (
                                        <div
                                            key={edu.id}
                                            className="border-l-2 border-blue-500 pl-4"
                                        >
                                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                                <svg
                                                    className="w-4 h-4 text-gray-400"
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
                                                </svg>
                                                {EDUCATION_DEGREE_LABELS[edu.degree]} in{" "}
                                                {edu.fieldOfStudy}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {edu.institution}
                                                {edu.gpa && ` • GPA ${edu.gpa}/4.0`}
                                                {edu.country && ` • ${edu.country}`}
                                                {` • ${edu.startYear} - ${edu.endYear || "Present"}`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Work Experience */}
                        {applicant.workExperience.length > 0 && (
                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Work Experience
                                </h3>
                                <div className="space-y-4">
                                    {applicant.workExperience.map((exp) => (
                                        <div
                                            key={exp.id}
                                            className="border-l-2 border-green-500 pl-4"
                                        >
                                            <h4 className="font-medium text-gray-900">
                                                {exp.title}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {exp.company} • {exp.startDate} -{" "}
                                                {exp.endDate || "Present"}
                                            </p>
                                            {exp.description && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Skills */}
                    <div>
                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {applicant.skills.map((skill) => (
                                    <Badge key={skill.id} variant="info">
                                        {skill.name}
                                    </Badge>
                                ))}
                                {applicant.skills.length === 0 && (
                                    <p className="text-sm text-gray-500">No skills listed</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* TODO: Applicant details not finalized - attributes may change */}
            <div className="px-6 py-4 border-t bg-gray-50 text-center">
                <p className="text-xs text-gray-400 italic">
                    Note: Applicant details are still being finalized. Some information may change.
                </p>
            </div>
        </HeadlessModal>
    );
};
