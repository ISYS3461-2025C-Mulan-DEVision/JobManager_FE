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
        UNPUBLISH: (id: string) => `/job-posts/${id}/unpublish`,
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
        // Profile endpoints
        PROFILE: (id: string) => `/companies/${id}/profile`,
        // Media endpoints
        MEDIA: {
            BASE: (id: string) => `/companies/${id}/media`,
            LOGO: (id: string) => `/companies/${id}/media/logo`,
            BANNER: (id: string) => `/companies/${id}/media/banner`,
            GET: (companyId: string, mediaId: string) =>
                `/companies/${companyId}/media/${mediaId}`,
            REORDER: (id: string) => `/companies/${id}/media/reorder`,
        },
        // Dial codes
        DIAL_CODES: "/companies/dial-codes",
    },

    // Applicant Search
    APPLICANT_SEARCH: {
        SEARCH: "/internal/applicants/search",
        SKILLS: "/internal/applicants/skills",
        SKILLS_SEARCH: "/internal/applicants/skills/search",
    },

    // Search Profiles (Premium Feature)
    SEARCH_PROFILES: {
        // External endpoint (read-only)
        ACTIVE: "/search-profiles/active",
        // Internal endpoints (via gateway routing)
        BASE: "/internal/search-profiles",
        CREATE: "/internal/search-profiles",
        GET: (id: string) => `/internal/search-profiles/${id}`,
        UPDATE: (id: string) => `/internal/search-profiles/${id}`,
        DELETE: (id: string) => `/internal/search-profiles/${id}`,
        BY_COMPANY: (companyId: string) =>
            `/internal/search-profiles/company/${companyId}`,
        ACTIVE_BY_COMPANY: (companyId: string) =>
            `/internal/search-profiles/company/${companyId}/active`,
        UPDATE_STATUS: (id: string) => `/internal/search-profiles/${id}/status`,
    },

    // Subscriptions
    SUBSCRIPTIONS: {
        // External endpoints
        STATUS: (companyId: string) => `/subscriptions/company/${companyId}`,
        IS_PREMIUM: (companyId: string) =>
            `/subscriptions/company/${companyId}/is-premium`,
    },
} as const;
