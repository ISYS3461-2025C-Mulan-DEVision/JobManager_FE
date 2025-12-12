import React from "react";
import AuthLayout from "../layout/AuthLayout";

export default function RegistrationPage() {
    return (
        <AuthLayout>
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
                    <p>Registration form coming soon...</p>
                </div>
            </div>
        </AuthLayout>
    );
}