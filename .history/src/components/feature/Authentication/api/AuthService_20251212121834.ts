// import { HttpClient } from "../../../../services/httpClient";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignupPayload {
    companyName: string;
    email: string;
    password: string;
    confirmPassword: string;
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
    // return HttpClient.post('/auth/company/signup', payload);

    // Mock implementation for now
    console.log("Signing up company with:", payload);
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
