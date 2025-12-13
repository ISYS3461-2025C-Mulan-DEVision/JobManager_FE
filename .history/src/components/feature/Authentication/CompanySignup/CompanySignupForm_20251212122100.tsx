import React from "react";
import { Link } from "react-router-dom";
import { Input, Button, Alert, GoogleLogo } from "@/components/ui";
import { SignupPayload } from "./types.ts";

interface CompanySignupFormProps {
    values: SignupPayload;
    errors: Partial<Record<keyof SignupPayload, string>>;
    touched: Partial<Record<keyof SignupPayload, boolean>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (field: keyof SignupPayload) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    error: string | null;
}

export const CompanySignupForm: React.FC<CompanySignupFormProps> = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isLoading,
    error,
}) => {
    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 py-4 px-1 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                    Company Registration
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Create your company account
                </p>
            </div>

            <div className="w-full max-w-md bg-white py-8 px-6 shadow rounded-lg">
                {error && (
                    <Alert type="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Company Name *"
                        id="companyName"
                        name="companyName"
                        type="text"
                        autoComplete="organization"
                        required
                        value={values.companyName}
                        onChange={handleChange}
                        onBlur={() => handleBlur("companyName")}
                        error={touched.companyName ? errors.companyName : undefined}
                        fullWidth
                    />

                    <Input
                        label="Email *"
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={values.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur("email")}
                        error={touched.email ? errors.email : undefined}
                        fullWidth
                    />

                    <Input
                        label="Password *"
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={values.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur("password")}
                        error={touched.password ? errors.password : undefined}
                        fullWidth
                    />

                    <Input
                        label="Confirm Password *"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={() => handleBlur("confirmPassword")}
                        error={touched.confirmPassword ? errors.confirmPassword : undefined}
                        fullWidth
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={isLoading}
                    >
                        Sign Up
                    </Button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                // TODO: Implement Google OAuth flow
                                window.location.href = `${import.meta.env.VITE_API_URL || ''}/auth/google`;
                            }}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <GoogleLogo className="mr-2" />
                            Sign up with Google
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
