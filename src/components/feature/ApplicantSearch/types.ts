// Applicant Search Types

import { EDUCATION_DEGREES, EMPLOYMENT_TYPES, APPLICANT_SORT_OPTIONS } from "@/utils/constants";

// Education Degree enum
export type EducationDegree = typeof EDUCATION_DEGREES[keyof typeof EDUCATION_DEGREES];

// Employment Type enum
export type EmploymentType = typeof EMPLOYMENT_TYPES[keyof typeof EMPLOYMENT_TYPES];

// Sort options
export type ApplicantSortOption = typeof APPLICANT_SORT_OPTIONS[keyof typeof APPLICANT_SORT_OPTIONS];

// ============================================================
// Search State (Frontend UI State)
// ============================================================

export interface SearchState {
    keyword: string;
    countryCode?: string;
    employmentTypes: EmploymentType[];
    highestDegree?: EducationDegree;
    minSalary?: number;
    maxSalary?: number;
    skillIds: string[];
    sortBy: ApplicantSortOption;
    page: number;
    pageSize: number;
}

export const DEFAULT_SEARCH_STATE: SearchState = {
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

// ============================================================
// Saved Profile State (Frontend UI State)
// ============================================================

export interface SavedProfileState {
    selectedProfileId?: string;
    isEditing: boolean;
}

// ============================================================
// API Request/Response Types
// ============================================================

// Search Profile - Create Request
export interface CreateSearchProfileRequest {
    companyId: string;
    profileName: string;
    countryCode?: string;
    minSalary?: number;
    maxSalary?: number;
    highestDegree?: EducationDegree;
    employmentTypes?: EmploymentType[];
    skillIds?: string[];
    isActive?: boolean;
}

// Search Profile - Update Request
export interface UpdateSearchProfileRequest {
    profileName?: string;
    countryCode?: string;
    minSalary?: number;
    maxSalary?: number;
    highestDegree?: EducationDegree;
    employmentTypes?: EmploymentType[];
    skillIds?: string[];
    isActive?: boolean;
}

// Search Profile - Update Status Request
export interface UpdateStatusRequest {
    isActive: boolean;
}

// Search Profile - Response (Internal)
export interface SearchProfileResponse {
    id: string;
    companyId: string;
    profileName: string;
    countryCode?: string;
    minSalary?: number;
    maxSalary?: number;
    highestDegree?: EducationDegree;
    employmentTypes: EmploymentType[];
    skillIds: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Search Profile - Active Response (External, read-only)
export interface ActiveSearchProfileResponse {
    id: string;
    companyId: string;
    profileName: string;
    countryCode?: string;
    minSalary?: number;
    maxSalary?: number;
    highestDegree?: EducationDegree;
    employmentTypes: EmploymentType[];
    skillIds: string[];
}

// ============================================================
// Applicant Types
// TODO: Applicant attributes are not finalized yet
// These fields may change when backend is finalized
// ============================================================

export interface ApplicantSkill {
    id: string;
    name: string;
}

export interface ApplicantEducation {
    id: string;
    degree: EducationDegree;
    fieldOfStudy: string;
    institution: string;
    gpa?: number;
    country?: string;
    startYear: number;
    endYear?: number;
}

export interface ApplicantWorkExperience {
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description?: string;
}

// TODO: Applicant model not finalized - salary might be removed
export interface Applicant {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    bio?: string;
    countryCode?: string;
    highestDegree?: EducationDegree;
    employmentType?: EmploymentType;
    minSalary?: number;
    maxSalary?: number;
    skills: ApplicantSkill[];
    education: ApplicantEducation[];
    workExperience: ApplicantWorkExperience[];
    createdAt: string;
    updatedAt: string;
    // TODO: Mark as Warning/Favorite feature - not implemented yet
    // isFavorite?: boolean;
    // isWarning?: boolean;
}

// Applicant Search Response (Paginated)
export interface ApplicantSearchResponse {
    content: Applicant[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
}

// ============================================================
// Common API Response Wrapper
// ============================================================

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Paged response wrapper
export interface PagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
}

// ============================================================
// Country type (from auth service)
// ============================================================

export interface Country {
    code: string;
    displayName: string;
}
