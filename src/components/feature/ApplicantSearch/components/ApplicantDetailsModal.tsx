import React, { useState } from "react";
import { HeadlessModal } from "@/components/headless";
import { Badge } from "@/components/ui";
import { EDUCATION_DEGREE_LABELS } from "@/utils/constants";
import {
  X,
  User,
  GraduationCap,
  Phone,
  Copy,
  Star,
  AlertCircle,
} from "lucide-react";
import type { Applicant, ApplicantStatusType } from "../types";

interface ApplicantDetailsModalProps {
  applicant: Applicant | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (
    applicantId: string,
    status: ApplicantStatusType,
  ) => Promise<void>;
}

export const ApplicantDetailsModal: React.FC<ApplicantDetailsModalProps> = ({
  applicant,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!applicant) return null;

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStatus = e.target.value as ApplicantStatusType;
    if (onStatusChange && newStatus !== applicant.companyStatus) {
      setIsUpdatingStatus(true);
      try {
        await onStatusChange(applicant.id, newStatus);
      } finally {
        setIsUpdatingStatus(false);
      }
    }
  };

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
          className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
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
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {applicant.fullName}
              </h1>
              {applicant.companyStatus === "FAVORITE" && (
                <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
              )}
              {applicant.companyStatus === "WARNING" && (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
              {applicant.education && applicant.education.length > 0 && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {applicant.education[0].degree}
                </span>
              )}
              {((applicant.education && applicant.education.length > 0) ||
                applicant.city) &&
                applicant.countryCode && <span>•</span>}
              {applicant.city && <span>{applicant.city}</span>}
              {applicant.city && applicant.countryCode && <span>,</span>}
              {applicant.countryCode && <span>{applicant.countryCode}</span>}
            </div>

            {/* Mark as dropdown */}
            <div className="mt-3">
              <select
                value={applicant.companyStatus || "NONE"}
                onChange={handleStatusChange}
                disabled={isUpdatingStatus}
                className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="NONE">No status</option>
                <option value="FAVORITE">⭐ Favorite</option>
                <option value="WARNING">⚠️ Warning</option>
              </select>
              {isUpdatingStatus && (
                <span className="ml-2 text-sm text-gray-500">Updating...</span>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex-shrink-0 text-right">
            <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
            {applicant.phone && (
              <p className="flex items-center justify-end gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {applicant.phone}
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Copy className="w-4 h-4" />
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
                        <GraduationCap className="w-4 h-4 text-gray-400" />
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
                      <h4 className="font-medium text-gray-900">{exp.title}</h4>
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
      {/* Footer */}
      <div className="px-6 py-4 border-t bg-gray-50 text-center">
        <p className="text-xs text-gray-400 italic">
          Contact information is shared with the applicant's consent.
        </p>
      </div>
    </HeadlessModal>
  );
};
