import React from "react";
import { useCompanyLogin } from "./hooks/useCompanyLogin";
import { LoginFormUI } from "./ui/LoginFormUI";

export const CompanyLogin: React.FC = () => {
    const { formData, handleChange, handleSubmit, isLoading, error } =
        useCompanyLogin();

    return (
        <LoginFormUI
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
        />
    );
};
