// import { HttpClient } from "../../../../services/httpClient";

import type { SignupPayload } from "../CompanySignup/types.ts";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export const loginCompany = async (payload: LoginPayload) => {
    // Replace with actual API endpoint
    // return HttpClient.post('/auth/company/login', payload);

    // Mock implementation for now
    console.log("Logging in company with:", payload);
    return new Promise((resolve) => {
        setTimeout(
            () =>
                resolve({
                    token: "mock-token",
                    user: { name: "Company Admin" },
                }),
            1000,
        );
    });
};

export const signupCompany = async (payload: SignupPayload) => {
    // Replace with actual API endpoint
    // const formData = new FormData();
    // Object.entries(payload).forEach(([key, value]) => {
    //     if (key === "companyLogo" && value instanceof File) {
    //         formData.append(key, value);
    //     } else if (typeof value === "string") {
    //         formData.append(key, value);
    //     }
    // });
    // return HttpClient.post('/auth/company/signup', formData);

    // Mock implementation for now
    const { companyLogo, ...rest } = payload;
    console.log("Signing up company with:", {
        ...rest,
        companyLogo: companyLogo ? companyLogo.name : null,
    });
    return new Promise((resolve) => {
        setTimeout(
            () =>
                resolve({
                    token: "mock-token",
                    user: { name: payload.companyName },
                }),
            1000,
        );
    });
};

const AuthService = {
    loginCompany,
    signupCompany,
};

export default AuthService;

export type { SignupPayload };
