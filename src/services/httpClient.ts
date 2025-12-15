import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "@/utils/constants";
import { clearAuthSession, getAccessToken } from "./authStorage";

const httpClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
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
        if (error?.response?.status === 401) {
            clearAuthSession();
        }
        return Promise.reject(error);
    }
);

export default httpClient;
