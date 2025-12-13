import React from "react";
import { HeadlessForm } from "@/components/headless";
import { CompanySignupForm } from "./CompanySignupForm.tsx";
import { useCompanySignup } from "./hooks/useCompanySignup";
import { SignupPayload } from "./types";

// Validation function
const validateSignupForm = (values: SignupPayload) => {
    const errors: Partial<Record<keyof SignupPayload, string>> = {};

    if (!values.companyName) {
        errors.companyName = "Company name is required";
    }

    if (!values.email) {
        errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address";
    }

    if (!values.password) {
        errors.password = "Password is required";
    } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
};

export const CompanySignup: React.FC = () => {
    const { signup, isLoading, error } = useCompanySignup();

    return (
        <HeadlessForm<SignupPayload>
            initialValues={{ companyName: "", email: "", password: "", confirmPassword: "" }}
            onSubmit={signup}
            validate={validateSignupForm}
        >
            {(formProps) => (
                <CompanySignupForm
                    {...formProps}
                    isLoading={isLoading}
                    error={error}
                />
            )}
        </HeadlessForm>
    );
};
