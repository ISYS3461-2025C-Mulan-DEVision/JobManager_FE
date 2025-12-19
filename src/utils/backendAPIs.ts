// Backend API Endpoints
export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        REFRESH: "/auth/refresh",
        PROFILE: "/auth/profile",
    },

    // Job Posts
    JOB_POSTS: {
        BASE: "/job-posts",
        LIST: "/job-posts",
        CREATE: "/job-posts",
        GET: (id: string) => `/job-posts/${id}`,
        UPDATE: (id: string) => `/job-posts/${id}`,
        DELETE: (id: string) => `/job-posts/${id}`,
        PUBLISH: (id: string) => `/job-posts/${id}/publish`,
        ARCHIVE: (id: string) => `/job-posts/${id}/archive`,
        STATS: (id: string) => `/job-posts/${id}/stats`,
        BY_COMPANY: (companyId: string) => `/job-posts/company/${companyId}`,
        BY_COMPANY_PUBLISHED: (companyId: string) =>
            `/job-posts/company/${companyId}/published`,
    },

    // Applications
    APPLICATIONS: {
        BASE: "/applications",
        LIST: "/applications",
        GET: (id: string) => `/applications/${id}`,
        CREATE: "/applications",
        UPDATE: (id: string) => `/applications/${id}`,
        BY_JOB_POST: (jobPostId: string) =>
            `/job-posts/${jobPostId}/applications`,
    },

    // Companies
    COMPANIES: {
        BASE: "/companies",
        LIST: "/companies",
        GET: (id: string) => `/companies/${id}`,
        UPDATE: (id: string) => `/companies/${id}`,
    },
} as const;
