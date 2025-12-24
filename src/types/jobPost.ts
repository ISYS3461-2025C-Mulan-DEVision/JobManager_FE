// Job Post related types
import {
    JOB_STATUS,
    EMPLOYMENT_TYPES,
    SALARY_TYPES,
    SYNC_STATUS,
} from "@/utils/constants";
import { UUID } from "crypto";

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];
export type EmploymentType =
    (typeof EMPLOYMENT_TYPES)[keyof typeof EMPLOYMENT_TYPES];
export type SalaryType = (typeof SALARY_TYPES)[keyof typeof SALARY_TYPES];
export type SyncStatus = (typeof SYNC_STATUS)[keyof typeof SYNC_STATUS];

/**
 * JobPost interface matching the database schema
 */
export interface JobPost {
    // Database fields
    jobPostId: number; // bigint in DB
    title: string;
    description: string;
    isPublished: boolean; // Maps to PUBLISHED status
    isPrivate: boolean; // Maps to PRIVATE status
    isFresher: boolean; // Whether accepting fresh graduates
    companyId: string; // uuid
    countryId: string; // uuid
    locationCity: string;
    salaryMin: number | null; // numeric in DB
    salaryMax: number | null; // numeric in DB
    salaryType: SalaryType; // RANGE, ABOUT, UP_TO, FROM, or NEGOTIABLE
    salaryNote: string | null; // Additional salary information
    expiryAt: string; // timestamp
    postedAt: string | null; // timestamp - when published
    createdAt: string; // timestamp
    updatedAt: string; // timestamp

    // Frontend computed/extended fields
    id?: string; // Computed from jobPostId for compatibility
    status?: JobStatus; // Computed from isPublished + isPrivate
    employmentType?: EmploymentType; // May come from additional data
    location?: string; // Computed from locationCity
    expiryDate?: string; // Alias for expiryAt
    publishedDate?: string; // Alias for postedAt
    applicationsCount?: number; // From stats endpoint
    syncStatus?: SyncStatus; // Kafka sync status
    companyName?: string; // From company join
    countryName?: string; // From country join
}

export interface JobPostFilters {
    status?: JobStatus[];
    employmentType?: EmploymentType[];
    search?: string;
    page?: number;
    pageSize?: number;
}

/**
 * Request payload for creating a new job post
 * Matches backend API expectations
 */
export interface CreateJobPostRequest {
    title: string;
    description: string;
    companyId: string;
    countryId: string;
    locationCity: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryType: SalaryType;
    salaryNote?: string;
    isFresher: boolean;
    expiryAt: string; // ISO 8601 timestamp
    isPrivate?: boolean; // Default: false
}

/**
 * Request payload for updating an existing job post
 */
export interface UpdateJobPostRequest {
    title?: string;
    description?: string;
    countryId?: string;
    locationCity?: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryType?: SalaryType;
    salaryNote?: string;
    isFresher?: boolean;
    expiryAt?: string;
    isPublished?: boolean; // Publish/unpublish
    isPrivate?: boolean; // Make private/public
}
