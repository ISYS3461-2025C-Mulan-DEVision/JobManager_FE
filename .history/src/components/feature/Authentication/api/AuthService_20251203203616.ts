// import { HttpClient } from "../../../../services/httpClient";

export interface LoginPayload {
  email: string;
  password: string;
}

export const loginCompany = async (payload: LoginPayload) => {
  // Replace with actual API endpoint
  // return HttpClient.post('/auth/company/login', payload);
  
  // Mock implementation for now
  console.log("Logging in company with:", payload);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ token: "mock-token", user: { name: "Company Admin" } }), 1000);
  });
};

const AuthService = {
  loginCompany,
};

export default AuthService;