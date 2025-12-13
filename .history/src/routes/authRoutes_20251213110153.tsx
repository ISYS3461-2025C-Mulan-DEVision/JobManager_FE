import { Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegistrationPage from "../pages/auth/RegistrationPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

export const authRoutes = [
    <Route key="login" path="/login" element={<LoginPage />} />,
    <Route key="register" path="/register" element={<RegistrationPage />} />,
    <Route key="forgot-password" path="/forgot-password" element={<ForgotPasswordPage />} />,
];
