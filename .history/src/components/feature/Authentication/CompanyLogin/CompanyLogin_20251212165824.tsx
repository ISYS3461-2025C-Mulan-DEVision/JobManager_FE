import React from "react";
import { HeadlessForm } from "@/components/headless";
import { CompanyLoginForm } from "./CompanyLoginForm";
import { useCompanyLogin } from "./hooks/useCompanyLogin";
import { LoginPayload } from "../api/AuthService";

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
        <section className="relative overflow-hidden px-6 pt-12 pb-14">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-28 right-[-6rem] h-80 w-80 rounded-full bg-filled-button/10 blur-2xl" />
                <div className="absolute -bottom-40 left-[-8rem] h-96 w-96 rounded-full bg-filled-button/10 blur-3xl" />
            </div>
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
        </section>
    );
};
