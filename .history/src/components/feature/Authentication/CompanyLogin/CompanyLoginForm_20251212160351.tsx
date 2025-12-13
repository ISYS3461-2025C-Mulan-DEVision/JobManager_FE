import React from "react";
import { Link } from "react-router-dom";
import { Input, Button, Alert, GoogleLogo } from "@/components/ui";
import { LoginPayload } from "../api/AuthService";

interface CompanyLoginFormProps {
    values: LoginPayload;
    errors: Partial<Record<keyof LoginPayload, string>>;
    touched: Partial<Record<keyof LoginPayload, boolean>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (field: keyof LoginPayload) => void;
    isLoading: boolean;
    error: string | null;
    onDismissError?: () => void;
}

export const CompanyLoginForm: React.FC<CompanyLoginFormProps> = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isLoading,
    error,
    onDismissError,
}) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [capsLockOn, setCapsLockOn] = React.useState(false);
    const [rememberMe, setRememberMe] = React.useState(true);
    const [showResetHint, setShowResetHint] = React.useState(false);

    const apiBase = import.meta.env.VITE_API_URL ?? "";

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold tracking-tight text-heading">Welcome back</h2>
            <div className="text-center">

                <p className="mt-2 text-sm text-gray-600">Sign in to manage jobs and applicants.</p>
            </div>

            {error && (
                <Alert type="error" className="mt-6" onClose={onDismissError} title="Sign-in failed">
                    {error}
                </Alert>
            )}

            {showResetHint && (
                <Alert type="info" className="mt-4" onClose={() => setShowResetHint(false)} title="Password reset">
                    Password reset isn’t implemented yet.
                </Alert>
            )}

            <div className="mt-6 space-y-5">
                <Input
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@company.com"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    error={touched.email ? errors.email : undefined}
                    helperText={!touched.email ? "Use your company email address." : undefined}
                    fullWidth
                />

                <Input
                    label="Password"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    onKeyUp={(e) => setCapsLockOn((e as any).getModifierState?.("CapsLock") ?? false)}
                    error={touched.password ? errors.password : undefined}
                    helperText={capsLockOn ? "Caps Lock is on." : undefined}
                    endAdornment={
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    }
                    fullWidth
                />

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Remember me
                    </label>

                    <button
                        type="button"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        onClick={() => {
                            setShowResetHint(true);
                        }}
                    >
                        Forgot password?
                    </button>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                    disabled={!values.email || !values.password}
                >
                    Sign in
                </Button>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-xs font-medium text-gray-500">OR</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                        const target = `${apiBase}/auth/google`;
                        window.location.href = target;
                    }}
                    className="w-full inline-flex items-center justify-center"
                >
                    <GoogleLogo className="mr-2" />
                    Continue with Google
                </Button>

                <p className="pt-1 text-center text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Create one
                    </Link>
                </p>

                <p className="text-center text-xs text-gray-500">
                    By continuing you agree to your company’s hiring policies.
                </p>
            </div>
        </div>
    );
};
