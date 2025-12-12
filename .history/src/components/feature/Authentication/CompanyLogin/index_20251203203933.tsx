import React from "react";
import { useCompanyLogin } from "./hooks/useCompanyLogin";
import { LoginFormUI } from "./ui/LoginFormUI";
import { HeadlessForm } from "../../../../headless";
import { LoginPayload } from "./api/AuthService"; // Assuming this import path needs adjustment or type is available

export const CompanyLogin: React.FC = () => {
    const { login, isLoading, error } = useCompanyLogin();

    return (
        <HeadlessForm<LoginPayload>
            initialValues={{ email: '', password: '' }}
            onSubmit={login}
        >
            {({ values, handleChange, handleSubmit }) => (
                <LoginFormUI
                    formData={values}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    error={error}
                />
            )}
        </HeadlessForm>
    );
};
