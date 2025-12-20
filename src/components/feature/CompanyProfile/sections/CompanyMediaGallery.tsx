import React, { useState, useCallback } from "react";
import { Alert, Spinner, FileUpload } from "@/components/ui";
import { useCompanyMedia } from "../hooks/useCompanyMedia";
import type { CompanyMedia, MediaReorderItem } from "../types";

// Drag and drop gallery item
interface MediaItemProps {
    media: CompanyMedia;
    onDelete: (id: string) => void;
    onDragStart: (e: React.DragEvent, index: number) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, index: number) => void;
    index: number;
}

const MediaItem: React.FC<MediaItemProps> = ({
    media,
    onDelete,
    onDragStart,
    onDragOver,
    onDrop,
    index,
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const isImage = media.mediaType === "IMAGE" || media.mediaType === "GALLERY";
    const isVideo = media.mediaType === "VIDEO";

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
            className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-move border-2 border-transparent hover:border-blue-400 transition-colors"
        >
            {isImage && (
                <img
                    src={media.url}
                    alt={media.title || "Media"}
                    className="w-full h-full object-cover"
                    draggable={false}
                />
            )}
            {isVideo && (
                <video
                    src={media.url}
                    className="w-full h-full object-cover"
                    draggable={false}
                />
            )}
            {!isImage && !isVideo && (
                <div className="flex items-center justify-center h-full">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>
            )}

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                {showDeleteConfirm ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onDelete(media.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Drag indicator */}
            <div className="absolute top-2 left-2 bg-white bg-opacity-80 rounded p-1">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
            </div>

            {/* Title */}
            {media.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 truncate">
                    {media.title}
                </div>
            )}
        </div>
    );
};

export const CompanyMediaGallery: React.FC = () => {
    const {
        mediaItems,
        isLoading,
        isUploading,
        error,
        successMessage,
        uploadNewMedia,
        deleteMediaItem,
        reorderMediaItems,
        clearMessages,
    } = useCompanyMedia();

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleUpload = useCallback((file: File) => {
        const mediaType = file.type.startsWith("video/") ? "VIDEO" : "IMAGE";
        uploadNewMedia({
            file,
            mediaType,
            title: file.name.split(".")[0],
        });
    }, [uploadNewMedia]);

    const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            return;
        }

        // Calculate new order
        const newItems = [...mediaItems];
        const [draggedItem] = newItems.splice(draggedIndex, 1);
        newItems.splice(dropIndex, 0, draggedItem);

        // Create reorder payload
        const reorderPayload: MediaReorderItem[] = newItems.map((item, index) => ({
            mediaId: item.id,
            displayOrder: index,
        }));

        reorderMediaItems(reorderPayload);
        setDraggedIndex(null);
    }, [draggedIndex, mediaItems, reorderMediaItems]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Media & Showcase</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your company's media gallery. Drag and drop to reorder items.
                </p>
            </div>

            {error && (
                <Alert type="error" onClose={clearMessages}>
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert type="success" onClose={clearMessages}>
                    {successMessage}
                </Alert>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaItems.map((media, index) => (
                    <MediaItem
                        key={media.id}
                        media={media}
                        index={index}
                        onDelete={deleteMediaItem}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    />
                ))}
                <FileUpload
                    onUpload={handleUpload}
                    isUploading={isUploading}
                    accept="image/*,video/*"
                    label="Add Media"
                />
            </div>

            {mediaItems.length === 0 && !isUploading && (
                <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No media uploaded yet</p>
                    <p className="text-sm">Upload images or videos to showcase your company</p>
                </div>
            )}
        </div>
    );
};

export default CompanyMediaGallery;
