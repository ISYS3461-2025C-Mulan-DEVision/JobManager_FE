import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "@/utils/constants";
import { clearAuthSession, getAccessToken } from "./authStorage";

const httpClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

httpClient.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle redirect responses (302) - should not happen with maxRedirects: 0
        if (error?.response?.status === 302) {
            console.error("Unexpected redirect detected:", error.response);
            clearAuthSession();
            return Promise.reject(
                new Error("Authentication required. Please login again.")
            );
        }

        // Handle auth errors
        if (
            error?.response?.status === 401 ||
            error?.response?.status === 403
        ) {
            console.error("Authentication error:", error.response?.status);
            clearAuthSession();
        }

        return Promise.reject(error);
    }
);

export default httpClient;
