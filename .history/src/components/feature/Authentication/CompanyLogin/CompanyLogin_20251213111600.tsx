import React from "react";
import { HeadlessForm } from "@/components/headless";
import { LoginPayload } from "@/components/feature/Authentication/api/AuthService";
import { CompanyLoginForm } from "./CompanyLoginForm";
import { useCompanyLogin } from "./hooks/useCompanyLogin";

// Validation function
const validateLoginForm = (values: LoginPayload) => {
    const errors: Partial<Record<keyof LoginPayload, string>> = {};

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

    return errors;
};

export const CompanyLogin: React.FC = () => {
    const { login, isLoading, error, clearError } = useCompanyLogin();

    return (
        <HeadlessForm<LoginPayload>
            initialValues={{ email: "", password: "" }}
            onSubmit={login}
            validate={validateLoginForm}
        >

            {({ values, errors, touched, handleChange, handleBlur }) => (
                <CompanyLoginForm
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    isLoading={isLoading}
                    error={error}
                    onDismissError={clearError}
                />
            )}
        </HeadlessForm>
    );
};
