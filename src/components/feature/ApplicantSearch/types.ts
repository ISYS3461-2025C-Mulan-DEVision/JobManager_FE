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
    // TODO: Salary filtering - JA service does not have salary fields yet
    // Uncomment when JA adds salary support to UserResponse
    // minSalary?: number;
    // maxSalary?: number;
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
    // TODO: Salary filtering - uncomment when JA adds salary support
    // minSalary: undefined,
    // maxSalary: undefined,
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
// Aligned with JA service's UserResponse
// ============================================================

export interface ApplicantSkill {
    id: string;
    name: string;
    usageCount?: number;
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

export interface ApplicantCountry {
    id: string;
    name: string;
    abbreviation: string;
}

/**
 * Applicant model - aligned with JA service's UserResponse.
 * 
 * Note: JA UserResponse uses 'objectiveSummary' which maps to 'bio' here.
 * Note: JA does not have education, work experience, or employmentTypes in search response.
 * These fields are populated from separate API calls or mock data.
 */
export interface Applicant {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName: string;
    phone?: string;
    avatarUrl?: string;
    /** Maps from JA's objectiveSummary */
    bio?: string;
    /** Nested country object from JA */
    country?: ApplicantCountry;
    /** Derived from country.abbreviation for backwards compatibility */
    countryCode?: string;
    premium?: boolean;
    active?: boolean;
    skills: ApplicantSkill[];
    // TODO: JA search does not return these - need separate API or mock
    highestDegree?: EducationDegree;
    employmentTypes: EmploymentType[];
    education: ApplicantEducation[];
    workExperience: ApplicantWorkExperience[];
    createdAt: string;
    updatedAt: string;
    // TODO: Salary - JA service does not have salary fields yet
    // desiredSalary?: number;
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
