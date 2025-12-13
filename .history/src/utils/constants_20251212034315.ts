// Application constants

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
export const API_TIMEOUT = 30000; // 30 seconds

// Authentication
export const TOKEN_KEY = "auth_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_KEY = "user_data";

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Validation
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 128;
export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 100;

// Routes
export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    DASHBOARD: "/dashboard",
    JOBS: "/jobs",
    JOB_DETAIL: "/jobs/:id",
    PROFILE: "/profile",
    SETTINGS: "/settings",
} as const;

// Status
export const JOB_STATUS = {
    DRAFT: "draft",
    PUBLISHED: "published",
    CLOSED: "closed",
    ARCHIVED: "archived",
} as const;

export const APPLICATION_STATUS = {
    PENDING: "pending",
    REVIEWED: "reviewed",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: "Network error. Please check your connection.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    NOT_FOUND: "The requested resource was not found.",
    SERVER_ERROR: "Server error. Please try again later.",
    VALIDATION_ERROR: "Please check your input and try again.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: "Successfully logged in.",
    LOGOUT_SUCCESS: "Successfully logged out.",
    SAVE_SUCCESS: "Successfully saved.",
    DELETE_SUCCESS: "Successfully deleted.",
    UPDATE_SUCCESS: "Successfully updated.",
} as const;
