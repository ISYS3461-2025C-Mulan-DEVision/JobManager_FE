import React from "react";
import { CompanyForgotPassword } from "../components/feature/Authentication/CompanyLogin";
import AuthLayout from "../layout/AuthLayout";

export default function ForgotPasswordPage() {
    return (
        <AuthLayout>
            <CompanyForgotPassword />
        </AuthLayout>
    );
}
