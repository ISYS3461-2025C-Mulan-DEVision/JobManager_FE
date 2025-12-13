export interface SignupPayload {
    companyName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SignupResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}

export interface AuthError {
    message: string;
    field?: string;
}
