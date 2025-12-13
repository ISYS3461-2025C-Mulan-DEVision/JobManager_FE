import { Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

export const authRoutes = [
    <Route key="login" path="/login" element={<LoginPage />} />,
    <Route key="register" path="/register" element={<RegistrationPage />} />,
    <Route key="forgot-password" path="/forgot-password" element={<ForgotPasswordPage />} />,
];
