import React, { useState } from "react";
import { Select, Button } from "@/components/ui";
import { HeadlessModal } from "@/components/headless";
import type { SearchProfileResponse, SearchState } from "../types";

interface SavedSearchProfilesProps {
    profiles: SearchProfileResponse[];
    selectedProfile: SearchProfileResponse | null;
    isPremium: boolean;
    isSaving: boolean;
    searchState: SearchState;
    onSelectProfile: (profileId: string | null) => void;
    onSaveAsNew: (name: string) => Promise<void>;
    onSaveChanges: () => Promise<void>;
    onDelete: () => Promise<void>;
}

export const SavedSearchProfiles: React.FC<SavedSearchProfilesProps> = ({
    profiles,
    selectedProfile,
    isPremium,
    isSaving,
    // searchState is passed but not used directly in this component
    // It's used by parent to create/update profiles
    onSelectProfile,
    onSaveAsNew,
    onSaveChanges,
    onDelete,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newProfileName, setNewProfileName] = useState("");
    const [nameError, setNameError] = useState("");

    const profileOptions = [
        { value: "", label: "Select profile" },
        ...profiles.map((p) => ({ value: p.id, label: p.profileName })),
    ];

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onSelectProfile(value || null);
    };

    const handleSaveAsNew = async () => {
        if (!newProfileName.trim()) {
            setNameError("Profile name is required");
            return;
        }
        if (newProfileName.length > 255) {
            setNameError("Profile name must be less than 255 characters");
            return;
        }

        await onSaveAsNew(newProfileName.trim());
        setIsModalOpen(false);
        setNewProfileName("");
        setNameError("");
    };

    const handleDelete = async () => {
        await onDelete();
        setIsDeleteModalOpen(false);
    };

    const openSaveModal = () => {
        setNewProfileName("");
        setNameError("");
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
                Saved Search Profiles
            </h3>

            {/* Profile Selector */}
            <Select
                options={profileOptions}
                value={selectedProfile?.id || ""}
                onChange={handleSelectChange}
                disabled={!isPremium || profiles.length === 0}
                fullWidth
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
                {selectedProfile && (
                    <>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={onSaveChanges}
                            disabled={!isPremium || isSaving}
                            className="flex items-center gap-1"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                />
                            </svg>
                            Save
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setIsDeleteModalOpen(true)}
                            disabled={!isPremium || isSaving}
                            className="flex items-center gap-1"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            Delete
                        </Button>
                    </>
                )}
            </div>

            {/* Save As New Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={openSaveModal}
                disabled={!isPremium || isSaving}
                fullWidth
                className="flex items-center justify-center gap-1"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
                Save As New
            </Button>

            {/* Premium Banner */}
            {!isPremium && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                        <svg
                            className="inline w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        Upgrade to Premium to save search profiles
                    </p>
                </div>
            )}

            {/* Editing indicator */}
            {selectedProfile && (
                <p className="text-sm text-gray-600 italic">
                    Editing profile: {selectedProfile.profileName}
                </p>
            )}

            {/* Save As New Modal */}
            <HeadlessModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            >
                <h2 className="text-lg font-semibold mb-4">Save Search Profile</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={newProfileName}
                        onChange={(e) => {
                            setNewProfileName(e.target.value);
                            setNameError("");
                        }}
                        placeholder="Enter profile name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={255}
                    />
                    {nameError && (
                        <p className="text-sm text-red-600 mt-1">{nameError}</p>
                    )}
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSaveAsNew}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </HeadlessModal>

            {/* Delete Confirmation Modal */}
            <HeadlessModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            >
                <h2 className="text-lg font-semibold mb-4">Delete Profile</h2>
                <p className="text-gray-600 mb-4">
                    Are you sure you want to delete "{selectedProfile?.profileName}"?
                    This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsDeleteModalOpen(false)}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        disabled={isSaving}
                    >
                        {isSaving ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </HeadlessModal>
        </div>
    );
};
