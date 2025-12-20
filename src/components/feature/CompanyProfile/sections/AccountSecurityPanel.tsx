import React, { useState } from "react";
import { Button, Input, Alert } from "@/components/ui";
import { HeadlessModal } from "@/components/headless";
import type { ChangeEmailPayload, ChangePasswordPayload } from "../types";

// Change Email Modal
interface ChangeEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ChangeEmailPayload) => Promise<void>;
}

const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await onSubmit({ newEmail, password });
            onClose();
            setNewEmail("");
            setPassword("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to change email");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setNewEmail("");
        setPassword("");
        setError(null);
        onClose();
    };

    return (
        <HeadlessModal
            isOpen={isOpen}
            onClose={handleClose}
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        >
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Email Address</h3>

                    {error && (
                        <Alert type="error" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    <div className="space-y-4">
                        <Input
                            label="New Email Address"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                            fullWidth
                        />
                        <Input
                            label="Current Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            helperText="Enter your current password to confirm this change"
                            required
                            fullWidth
                        />
                    </div>
                </div>

                <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Change Email
                    </Button>
                </div>
            </form>
        </HeadlessModal>
    );
};

// Change Password Modal
interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ChangePasswordPayload) => Promise<void>;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters long");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await onSubmit({ currentPassword, newPassword, confirmPassword });
            onClose();
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to change password");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError(null);
        onClose();
    };

    return (
        <HeadlessModal
            isOpen={isOpen}
            onClose={handleClose}
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        >
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>

                    {error && (
                        <Alert type="error" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    <div className="space-y-4">
                        <Input
                            label="Current Password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            fullWidth
                        />
                        <Input
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            helperText="Must be at least 8 characters"
                            required
                            fullWidth
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            fullWidth
                        />
                    </div>
                </div>

                <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Change Password
                    </Button>
                </div>
            </form>
        </HeadlessModal>
    );
};

// Main Account Security Panel
export const AccountSecurityPanel: React.FC = () => {
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Get current email from storage (in real app, this would come from auth context)
    const currentEmail = localStorage.getItem("user_email") || "company@example.com";

    // TODO: Implement actual API calls when Auth Service endpoints are ready
    const handleChangeEmail = async (data: ChangeEmailPayload): Promise<void> => {
        console.log("Change email request:", data);
        // TODO: Call Auth Service API
        // await authService.changeEmail(data);
        setSuccessMessage("Email change request sent. Please check your new email for verification.");
        throw new Error("Email change functionality is not yet implemented. Please contact support.");
    };

    const handleChangePassword = async (data: ChangePasswordPayload): Promise<void> => {
        console.log("Change password request:", data);
        // TODO: Call Auth Service API
        // await authService.changePassword(data);
        setSuccessMessage("Password changed successfully!");
        throw new Error("Password change functionality is not yet implemented. Please contact support.");
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Account & Security</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your account credentials and security settings.
                </p>
            </div>

            {successMessage && (
                <Alert type="success" onClose={() => setSuccessMessage(null)}>
                    {successMessage}
                </Alert>
            )}

            {/* Email Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Email Address</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Your email address is used for logging in and receiving notifications.
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-2">
                            {currentEmail}
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => setShowEmailModal(true)}>
                        Change Email
                    </Button>
                </div>
            </div>

            {/* Password Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Password</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Keep your account secure by using a strong password.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            ••••••••••••
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
                        Change Password
                    </Button>
                </div>
            </div>

            {/* Security Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Security Tips</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Use a unique password that you don't use for other accounts
                    </li>
                    <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Include a mix of letters, numbers, and special characters
                    </li>
                    <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Never share your password with anyone
                    </li>
                </ul>
            </div>

            {/* Modals */}
            <ChangeEmailModal
                isOpen={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                onSubmit={handleChangeEmail}
            />
            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSubmit={handleChangePassword}
            />
        </div>
    );
};

export default AccountSecurityPanel;
