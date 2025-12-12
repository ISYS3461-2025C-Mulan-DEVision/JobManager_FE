import React from "react";
import { CompanySignup } from "../components/feature/Authentication/CompanySignup";
import AuthLayout from "../layout/AuthLayout";

export default function RegistrationPage() {
    return (
        <AuthLayout
            sideContent={
                <div className="flex w-full items-center justify-center">
                    <img
                        src="/auth/background-login-left.png"
                        alt="Professionals collaborating during onboarding"
                        className="max-h-[600px] w-full object-contain"
                    />
                </div>
            }
        >
            <CompanySignup />
        </AuthLayout>
    );
}
