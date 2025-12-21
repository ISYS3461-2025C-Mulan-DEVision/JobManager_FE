import React from "react";
import { Link } from "react-router-dom";
import { HeadlessModal } from "@/components/headless";
import { Input, Button, Alert, GoogleLogo } from "@/components/ui";
import { SignupPayload } from "./types.ts";
import { validateSignupFields } from "./validation.ts";
import httpClient from "@/services/httpClient";
import AuthService from "../api/AuthService";
import { storeAuthSession } from "../../../../services/authStorage";
import { useNavigate } from "react-router-dom";

interface CompanySignupFormProps {
    values: SignupPayload;
    errors: Partial<Record<keyof SignupPayload, string>>;
    touched: Partial<Record<keyof SignupPayload, boolean>>;
    handleChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;
    handleBlur: (field: keyof SignupPayload) => void;
    setFieldValue: (field: keyof SignupPayload, value: any) => void;
    isLoading: boolean;
    isValid: boolean;
    error: string | null;
    success: string | null;
    onDismissError?: () => void;
    onDismissSuccess?: () => void;
}

export const CompanySignupForm: React.FC<CompanySignupFormProps> = (props) => {
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        isLoading,
        error,
        success,
        onDismissError,
        onDismissSuccess,
    } = props;

    const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:8081/api";
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = React.useState(0);
    const [stepErrors, setStepErrors] = React.useState<
        Partial<Record<keyof SignupPayload, string>>
    >({});
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [capsLockOn, setCapsLockOn] = React.useState(false);
    const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
    const [showSsoCompletion, setShowSsoCompletion] = React.useState(false);
    const [ssoErrors, setSsoErrors] = React.useState<Record<string, string>>(
        {}
    );
    const [ssoLoading, setSsoLoading] = React.useState(false);
    const [ssoFields, setSsoFields] = React.useState({
        companyName: values.companyName,
        email: values.email,
        country: values.country,
    });

    // Country list state
    const [countryList, setCountryList] = React.useState<
        Array<{ code: string; displayName: string }>
    >([]);
    const [countryLoading, setCountryLoading] = React.useState(true);
    const [countryError, setCountryError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let isMounted = true;
        setCountryLoading(true);
        setCountryError(null);
        httpClient
            .get("/auth/countries")
            .then((res) => {
                if (isMounted) {
                    setCountryList(res.data.data || []);
                    setCountryLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setCountryError("Failed to load country list");
                    setCountryLoading(false);
                }
            });
        return () => {
            isMounted = false;
        };
    }, [apiBase]);

    React.useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const sso = params.get("sso");
        const token = params.get("token");
        const email = params.get("email");
        const name = params.get("name");
        const successParam = params.get("success");
        const errorParam = params.get("error");

        console.log("SSO Callback Detection:", {
            sso,
            token: token ? token.substring(0, 20) + "..." : null,
            email,
            name,
            successParam,
            errorParam,
            fullURL: window.location.href,
        });

        // Handle error from backend
        if (sso === "google" && successParam === "false" && errorParam) {
            setSsoErrors({ general: decodeURIComponent(errorParam) });

            // Clean up URL
            params.delete("sso");
            params.delete("success");
            params.delete("error");
            const nextSearch = params.toString();
            const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`;
            window.history.replaceState(null, "", nextUrl);

            window.sessionStorage.removeItem("pending-google-sso");
            return;
        }

        // Handle successful SSO callback with token
        if (sso === "google" && token) {
            // Store token and user info in SSO fields
            setSsoFields({
                companyName: "",
                email: email ? decodeURIComponent(email) : "",
                country: "",
            });

            // Store token for later use
            window.sessionStorage.setItem("sso-token", token);

            setShowSsoCompletion(true);
            window.sessionStorage.removeItem("pending-google-sso");

            // Clean up URL parameters
            params.delete("sso");
            params.delete("token");
            params.delete("email");
            params.delete("name");
            const nextSearch = params.toString();
            const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`;
            window.history.replaceState(null, "", nextUrl);
        }
    }, []);

    const isGoogleSignup = values.signupMethod === "google";

    const steps = React.useMemo(
        () => [
            {
                id: "account",
                title: "Account basics",
                description: isGoogleSignup
                    ? "Confirm how we can reach you."
                    : "Set up your login credentials and region.",
                fields: (isGoogleSignup
                    ? ["email", "country"]
                    : [
                          "email",
                          "password",
                          "confirmPassword",
                          "country",
                      ]) as (keyof SignupPayload)[],
            },
            {
                id: "company",
                title: "Company profile",
                description:
                    "Let applicants learn more about your company before they apply.",
                fields: [
                    "companyName",
                    "phoneNumber",
                    "address",
                    "companyLogo",
                ] as (keyof SignupPayload)[],
            },
        ],
        [isGoogleSignup]
    );

    const activeStep = steps[currentStep];

    React.useEffect(() => {
        if (currentStep >= steps.length) {
            setCurrentStep(steps.length - 1);
        }
    }, [currentStep, steps.length]);

    React.useEffect(() => {
        if (!values.companyLogo) {
            setLogoPreview(null);
            return;
        }

        const nextPreview = URL.createObjectURL(values.companyLogo);
        setLogoPreview(nextPreview);

        return () => {
            URL.revokeObjectURL(nextPreview);
        };
    }, [values.companyLogo]);

    React.useEffect(() => {
        if (!showSsoCompletion) {
            setSsoErrors({});
        }
    }, [showSsoCompletion]);

    const displayedErrors = React.useMemo(
        () => ({ ...errors, ...stepErrors }),
        [errors, stepErrors]
    );

    const shouldShowError = React.useCallback(
        (field: keyof SignupPayload) =>
            Boolean(stepErrors[field] || touched[field]),
        [stepErrors, touched]
    );

    const getFieldError = React.useCallback(
        (field: keyof SignupPayload) =>
            shouldShowError(field) ? displayedErrors[field] : undefined,
        [displayedErrors, shouldShowError]
    );

    const clearStepError = React.useCallback(
        (field: keyof SignupPayload) => {
            if (!stepErrors[field]) {
                return;
            }

            setStepErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        },
        [stepErrors]
    );

    const handleFieldChange = React.useCallback(
        (
            event: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
        ) => {
            const field = event.target.name as keyof SignupPayload;
            clearStepError(field);
            handleChange(event);
        },
        [clearStepError, handleChange]
    );

    const handleNext = React.useCallback(() => {
        const validationResult = validateSignupFields(
            values,
            activeStep.fields
        );

        if (Object.keys(validationResult).length > 0) {
            setStepErrors(validationResult);
            activeStep.fields.forEach((field) => handleBlur(field));
            return;
        }

        setStepErrors({});
        setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    }, [activeStep.fields, handleBlur, steps.length, values]);

    const handlePrevious = React.useCallback(() => {
        setStepErrors({});
        setCurrentStep((step) => Math.max(step - 1, 0));
    }, []);

    const handleLogoChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0] ?? null;
            setFieldValue("companyLogo", file);
            clearStepError("companyLogo");
        },
        [clearStepError, setFieldValue]
    );

    const handleRemoveLogo = React.useCallback(() => {
        setFieldValue("companyLogo", null);
        clearStepError("companyLogo");
    }, [clearStepError, setFieldValue]);

    // const handleGoogleSignup = React.useCallback(() => {
    //     if (typeof window === "undefined") {
    //         return;
    //     }
    //
    //     window.sessionStorage.setItem("pending-google-sso", "1");
    //     window.location.href = `${apiBase}/auth/oauth2/google`;
    // }, [apiBase]);

    const handleGoogleSignup = () => {
        // Save that we're doing SSO registration, not login
        sessionStorage.setItem("sso_flow", "registration");

        // Redirect to backend OAuth2 endpoint - let Spring Security handle it
        window.location.href =
            "http://localhost:8081/oauth2/authorization/google";
    };

    const handleSsoFieldChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = event.target;
            setSsoFields((prev) => ({ ...prev, [name]: value }));

            if (!ssoErrors[name]) {
                return;
            }

            setSsoErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        },
        [ssoErrors]
    );

    const handleSsoSubmit = React.useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            const trimmedCountry = ssoFields.country.trim();

            const nextErrors: Record<string, string> = {};

            if (!trimmedCountry) {
                nextErrors.country = "Country is required";
            }

            if (Object.keys(nextErrors).length > 0) {
                setSsoErrors(nextErrors);
                return;
            }

            // Get the token from sessionStorage
            const token = window.sessionStorage.getItem("sso-token");

            if (!token) {
                setSsoErrors({
                    general: "Invalid SSO session. Please try again.",
                });
                return;
            }

            setSsoLoading(true);
            setSsoErrors({});

            try {
                console.log("Calling completeSsoRegistration with:", {
                    token: token.substring(0, 20) + "...",
                    country: trimmedCountry,
                });

                const response = await AuthService.completeSsoRegistration({
                    token: token,
                    country: trimmedCountry,
                });

                console.log("SSO completion response:", response);
                if (response.success && response.data) {
                    console.log(
                        "SSO registration successful, storing auth session"
                    );
                    // Store auth session
                    storeAuthSession({
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                        tokenType: response.data.tokenType,
                        expiresIn: response.data.expiresIn,
                        companyId: response.data.companyId,
                        email: response.data.email,
                        role: response.data.role,
                        authProvider: response.data.authProvider,
                    });

                    // Clean up
                    window.sessionStorage.removeItem("sso-token");
                    setShowSsoCompletion(false);

                    console.log("Navigating to dashboard");
                    // Navigate to dashboard
                    navigate("/dashboard", { replace: true });
                } else {
                    setSsoErrors({
                        general:
                            response.message ||
                            "Registration failed. Please try again.",
                    });
                }
            } catch (err: any) {
                console.error("SSO completion error:", err);
                console.error("Error response:", err.response);
                console.error("Error config:", err.config); // This shows the actual URL called

                if (err.response?.data?.message) {
                    setSsoErrors({ general: err.response.data.message });
                } else if (err.message) {
                    setSsoErrors({ general: err.message });
                } else {
                    setSsoErrors({
                        general: "Network error. Please try again.",
                    });
                }
            } finally {
                setSsoLoading(false);
            }
        },
        [ssoFields, navigate]
    );

    const accountStep = (
        <div className="space-y-5">
            <Input
                label="Company email *"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="name@company.com"
                value={values.email}
                onChange={handleFieldChange}
                onBlur={() => handleBlur("email")}
                error={getFieldError("email")}
                helperText="We will send account updates to this address."
                fullWidth
            />

            {!isGoogleSignup && (
                <>
                    <Input
                        label="Password *"
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        placeholder="Create a strong password"
                        value={values.password}
                        onChange={handleFieldChange}
                        onBlur={() => handleBlur("password")}
                        onKeyUp={(event) =>
                            setCapsLockOn(
                                (event as any).getModifierState?.("CapsLock") ??
                                    false
                            )
                        }
                        error={getFieldError("password")}
                        helperText={capsLockOn ? "Caps Lock is on." : undefined}
                        endAdornment={
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        }
                        fullWidth
                    />

                    <Input
                        label="Confirm password *"
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        placeholder="Re-enter your password"
                        value={values.confirmPassword}
                        onChange={handleFieldChange}
                        onBlur={() => handleBlur("confirmPassword")}
                        error={getFieldError("confirmPassword")}
                        endAdornment={
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword((prev) => !prev)
                                }
                                className="rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirmation password"
                                        : "Show confirmation password"
                                }
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        }
                        fullWidth
                    />
                </>
            )}

            <div>
                <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                >
                    Country *
                </label>
                {countryLoading ? (
                    <div className="mt-2 text-sm text-gray-500">
                        Loading countries...
                    </div>
                ) : countryError ? (
                    <div className="mt-2 text-sm text-red-600">
                        {countryError}
                    </div>
                ) : (
                    <select
                        id="country"
                        name="country"
                        className={`mt-2 block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            getFieldError("country")
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300"
                        }`}
                        value={values.country}
                        onChange={handleFieldChange}
                        onBlur={() => handleBlur("country")}
                        required
                    >
                        <option value="">Select a country</option>
                        {countryList.map((c) => (
                            <option key={c.code} value={c.code}>
                                {c.displayName}
                            </option>
                        ))}
                    </select>
                )}
                {getFieldError("country") && (
                    <span className="text-sm text-red-600">
                        {getFieldError("country")}
                    </span>
                )}
            </div>

            <Button
                type="button"
                variant="primary"
                size="md"
                fullWidth
                onClick={handleNext}
                disabled={isLoading || countryLoading}
            >
                Continue to company profile
            </Button>
        </div>
    );

    const companyStep = (
        <div className="space-y-6">
            <div className="flex flex-col items-center gap-3">
                {logoPreview ? (
                    <img
                        src={logoPreview}
                        alt="Company logo preview"
                        className="h-16 w-16 rounded-full object-cover shadow"
                    />
                ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-gray-300 text-xs text-gray-500">
                        Logo
                    </div>
                )}

                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                    <label className="flex-1 text-sm font-medium text-gray-700">
                        Company logo *
                        <input
                            type="file"
                            accept="image/*"
                            className="mt-2 w-full cursor-pointer rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleLogoChange}
                        />
                    </label>

                    {values.companyLogo && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleRemoveLogo}
                            className="self-end text-sm text-gray-600 hover:text-gray-800"
                        >
                            Remove
                        </Button>
                    )}
                </div>

                {shouldShowError("companyLogo") &&
                    getFieldError("companyLogo") && (
                        <span className="text-sm text-red-600">
                            {getFieldError("companyLogo")}
                        </span>
                    )}

                <p className="text-center text-xs text-gray-500">
                    Upload a square logo (PNG or JPG, up to 2MB recommended).
                </p>
            </div>

            <Input
                label="Company name *"
                id="companyName"
                name="companyName"
                type="text"
                autoComplete="organization"
                required
                placeholder="What should applicants see?"
                value={values.companyName}
                onChange={handleFieldChange}
                onBlur={() => handleBlur("companyName")}
                error={getFieldError("companyName")}
                fullWidth
            />

            <Input
                label="Phone number *"
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                placeholder="e.g. +1 555 123 4567"
                value={values.phoneNumber}
                onChange={handleFieldChange}
                onBlur={() => handleBlur("phoneNumber")}
                error={getFieldError("phoneNumber")}
                fullWidth
            />

            <div className="flex flex-col gap-1">
                <label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-700"
                >
                    Detailed address *
                </label>
                <textarea
                    id="address"
                    name="address"
                    rows={3}
                    placeholder="Street, city, and postal code"
                    className={`rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        getFieldError("address")
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300"
                    }`}
                    value={values.address}
                    onChange={handleFieldChange}
                    onBlur={() => handleBlur("address")}
                />
                {getFieldError("address") && (
                    <span className="text-sm text-red-600">
                        {getFieldError("address")}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePrevious}
                    disabled={isLoading}
                    className="w-full sm:w-1/2"
                >
                    Back
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                    disabled={isLoading}
                    className="w-full sm:w-1/2"
                >
                    Create account
                </Button>
            </div>
        </div>
    );

    return (
        <div className="w-full">
            {/* Only show traditional form when NOT in SSO completion mode */}
            {!showSsoCompletion ? (
                <>
                    <div className="text-center">
                        <h2 className="text-2xl tracking-tight text-gray-600">
                            Welcome to DEVision
                        </h2>
                        <p className="mt-2 text-3xl font-bold text-heading">
                            COMPANY SIGN UP
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                            Invite applicants with a branded employer profile.
                        </p>
                    </div>

                    {error && (
                        <Alert
                            type="error"
                            className="mt-6"
                            title="Registration failed"
                            onClose={onDismissError}
                        >
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            type="success"
                            className="mt-6"
                            title="Registration successful"
                            onClose={onDismissSuccess}
                        >
                            {success}
                        </Alert>
                    )}

                    <div className="mt-8 space-y-6">
                        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
                            {steps.map((step, index) => {
                                const isActive = index === currentStep;
                                const isCompleted = index < currentStep;
                                return (
                                    <div
                                        key={step.id}
                                        className="flex flex-col items-center text-center"
                                    >
                                        <span
                                            className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
                                                isActive
                                                    ? "bg-heading text-white"
                                                    : isCompleted
                                                      ? "border-blue-200 bg-blue-100 text-blue-600"
                                                      : "border-gray-300 bg-white text-gray-500"
                                            }`}
                                        >
                                            {index + 1}
                                        </span>
                                        <span className="mt-2 text-sm font-medium text-gray-700">
                                            {step.title}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 text-center">
                                <h3 className="text-lg font-semibold text-heading">
                                    {activeStep.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    {activeStep.description}
                                </p>
                            </div>

                            {currentStep === 0 ? accountStep : companyStep}
                        </div>

                        {currentStep === 0 && (
                            <>
                                <div className="relative py-2">
                                    <div
                                        className="absolute inset-0 flex items-center"
                                        aria-hidden="true"
                                    >
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white px-2 text-xs font-medium text-gray-500">
                                            OR
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleGoogleSignup}
                                    className="flex w-full items-center justify-center"
                                    disabled={isLoading}
                                >
                                    <GoogleLogo className="mr-2" />
                                    Continue with Google
                                </Button>
                            </>
                        )}

                        <p className="pt-2 text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign in
                            </Link>
                        </p>

                        <p className="text-center text-xs text-gray-500">
                            By continuing you agree to your company's hiring
                            policies.
                        </p>
                    </div>
                </>
            ) : null}

            {/* SSO Completion Modal */}
            <HeadlessModal
                isOpen={showSsoCompletion}
                onClose={() => setShowSsoCompletion(false)}
                overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            >
                <form onSubmit={handleSsoSubmit} className="space-y-5">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-heading">
                            Complete Google sign-up
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            We just need your country to finish your profile.
                        </p>
                    </div>

                    <Input
                        label="Email *"
                        id="sso-email"
                        name="email"
                        type="email"
                        value={ssoFields.email}
                        disabled
                        helperText="This is the email from your Google account."
                        fullWidth
                    />

                    <div>
                        <label
                            htmlFor="sso-country"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Country *
                        </label>
                        {countryLoading ? (
                            <div className="mt-2 text-sm text-gray-500">
                                Loading countries...
                            </div>
                        ) : countryError ? (
                            <div className="mt-2 text-sm text-red-600">
                                {countryError}
                            </div>
                        ) : (
                            <select
                                id="sso-country"
                                name="country"
                                className={`mt-2 block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    ssoErrors.country
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300"
                                }`}
                                value={ssoFields.country}
                                onChange={handleSsoFieldChange}
                                required
                                disabled={ssoLoading}
                            >
                                <option value="">Select a country</option>
                                {countryList.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.displayName}
                                    </option>
                                ))}
                            </select>
                        )}
                        {ssoErrors.country && (
                            <span className="text-sm text-red-600">
                                {ssoErrors.country}
                            </span>
                        )}
                    </div>

                    {ssoErrors.general && (
                        <div className="rounded-lg bg-red-50 p-3 border border-red-200">
                            <p className="text-sm text-red-600">
                                {ssoErrors.general}
                            </p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        isLoading={ssoLoading}
                        disabled={ssoLoading || countryLoading}
                    >
                        {ssoLoading
                            ? "Completing registration..."
                            : "Complete registration"}
                    </Button>
                </form>
            </HeadlessModal>
        </div>
    );
};
