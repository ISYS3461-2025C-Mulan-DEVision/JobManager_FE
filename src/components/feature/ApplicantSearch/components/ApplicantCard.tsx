import React from "react";
import { Badge, Card, Button } from "@/components/ui";
import {
  EMPLOYMENT_TYPE_LABELS,
  EDUCATION_DEGREE_LABELS,
} from "@/utils/constants";
import {
  User,
  GraduationCap,
  Clock,
  // TODO: Uncomment when JA adds salary support
  // CircleDollarSign,
  MapPin,
  Star,
  AlertCircle,
} from "lucide-react";
import type { Applicant, EducationDegree } from "../types";

interface ApplicantCardProps {
  applicant: Applicant;
  onClick: () => void;
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({
  applicant,
  onClick,
}) => {
  const isFavorite = applicant.companyStatus === "FAVORITE";
  const isWarning = applicant.companyStatus === "WARNING";

  // TODO: Salary display - uncomment when JA adds salary support
  // const formatSalary = (salary?: number): string => {
  //   if (!salary) return "Not specified";
  //   return `$${salary.toLocaleString()}`;
  // };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow relative">
      {/* Warning/Favorite indicators */}
      {isFavorite && (
        <span className="absolute top-2 right-2 text-yellow-500">
          <Star className="w-5 h-5" fill="currentColor" />
        </span>
      )}
      {isWarning && (
        <span
          className={`absolute top-2 ${isFavorite ? "right-9" : "right-2"} text-red-500`}
        >
          <AlertCircle className="w-5 h-5" />
        </span>
      )}

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
              <User className="w-6 h-6 text-gray-400" />
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
              <Badge variant="neutral">+{applicant.skills.length - 3}</Badge>
            )}
          </div>

          {/* Name & Email */}
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {applicant.fullName}
          </h3>
          <p className="text-sm text-gray-500 truncate">{applicant.email}</p>

          {/* Details */}
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
            {applicant.education && applicant.education.length > 0 && (
              <span className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4" />
                {applicant.education[0].degree &&
                  EDUCATION_DEGREE_LABELS[
                    applicant.education[0].degree as EducationDegree
                  ]}
              </span>
            )}
            {applicant.employmentTypes.length > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {applicant.employmentTypes
                  .map((t) => EMPLOYMENT_TYPE_LABELS[t])
                  .join(", ")}
              </span>
            )}
            {/* TODO: Salary display - uncomment when JA adds salary support */}
            {/* <span className="flex items-center gap-1">
              <CircleDollarSign className="w-4 h-4" />
              {formatSalary(applicant.desiredSalary)}
            </span> */}
            {applicant.countryCode && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
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
