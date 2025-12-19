import React, {useState, useEffect} from 'react';
import AuthService from '../api/AuthService';

interface Country {
    code: string;
    displayName: string;
}

interface SsoCompletionModalProps {
    isOpen: boolean;
    email: string;
    name: string;
    isLoading: boolean;
    error: string | null;
    onSubmit: (country: string) => void;
    onClose: () => void;
    // onClearError: () => void;
}

export const SsoCompletionModal: React.FC<SsoCompletionModalProps> = ({
                                                                          isOpen,
                                                                          email,
                                                                          name,
                                                                          isLoading,
                                                                          error,
                                                                          onSubmit,
                                                                          onClose,
                                                                      }) => {
    const [country, setCountry] = useState<string>('');
    const [validationError, setValidationError] = useState<string | null>(null);
    const [countries, setCountries] = useState<Country[]>([]);
    const [countriesLoading, setCountriesLoading] = useState<boolean>(false);
    const [countriesError, setCountriesError] = useState<string | null>(null);

    // fetch countries when modal opens
    useEffect(() => {
        if (isOpen && countries.length === 0) {
            fetchCountries();
        }
    }, [isOpen]);

    const fetchCountries = async () => {
        setCountriesLoading(true);
        setCountriesError(null);

        try {
            const response = await AuthService.getCountries();

            // Access the data directly from response.data
            if (response.data && Array.isArray(response.data)) {
                setCountries(response.data);
            } else if (Array.isArray(response)) {
                setCountries(response);
            } else {
                console.error('Unexpected countries response format:', response);
                setCountriesError('Failed to load countries.')
            }
        } catch (err) {
            console.error('Failed to fetch countries:', err);
            setCountriesError('Failed to load countries. Please try again.');
        } finally {
            setCountriesLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!country) {
            setValidationError('Please select a country');
            return;
        }

        setValidationError(null);
        onSubmit(country);
    };

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCountry(e.target.value);
        setValidationError(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Modal Content */}
                <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {/* Google Icon */}
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">
                                        Complete Your Registration
                                    </h2>
                                    <p className="text-sm text-blue-100">
                                        One more step to get started
                                    </p>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="rounded-full p-1 text-blue-100 hover:bg-blue-500 hover:text-white transition-colors"
                                aria-label="Close modal"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="px-6 py-5">
                        <p className="mb-5 text-sm text-gray-600">
                            We've verified your Google account. Please select your country to complete the registration.
                        </p>

                        {/* Email Field (read-only) */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
                            />
                        </div>

                        {/* Name Field (read-only, if available) */}
                        {name && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
                                />
                            </div>
                        )}

                        {/* Country Selection (required) */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country <span className="text-red-500">*</span>
                            </label>

                            {countriesLoading ? (
                                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-500 flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Loading countries...
                                </div>
                            ) : countriesError ? (
                                <div className="w-full">
                                    <div className="px-3 py-2 border border-red-300 rounded-lg bg-red-50 text-sm text-red-600 mb-2">
                                        {countriesError}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={fetchCountries}
                                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : (
                                <select
                                    value={country}
                                    onChange={handleCountryChange}
                                    required
                                    disabled={isLoading}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        validationError || error
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300 bg-white'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <option value="">Select your country</option>
                                    {countries.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            {c.displayName}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Error Messages */}
                        {(validationError || error) && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start">
                                    <svg className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-red-700">
                                        {validationError || error}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || countriesLoading || !!countriesError}
                            className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all ${
                                isLoading || countriesLoading || countriesError
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                            }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Completing Registration...
                </span>
                            ) : (
                                'Complete Registration'
                            )}
                        </button>

                        {/* Cancel Link */}
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="w-full mt-3 py-2 px-4 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                        >
                            Cancel and go back
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SsoCompletionModal;
