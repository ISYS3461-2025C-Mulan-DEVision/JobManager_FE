import { memo } from "react";
import { FileText, ImageIcon } from "lucide-react";
import clsx from "clsx";

export type MediaPreviewType = "image" | "video" | "document" | "unknown";

export interface MediaPreviewProps {
  /** URL of the media to display */
  url: string;
  /** Type of media */
  type: MediaPreviewType;
  /** Alt text for images */
  alt?: string;
  /** Aspect ratio of the preview */
  aspectRatio?: "square" | "video" | "auto";
  /** Whether to use lazy loading for images */
  lazy?: boolean;
  /** Additional class names */
  className?: string;
  /** Object fit style */
  objectFit?: "cover" | "contain" | "fill";
  /** Show video controls (only for video type) */
  showControls?: boolean;
}

const aspectRatioStyles = {
  square: "aspect-square",
  video: "aspect-video",
  auto: "",
};

export const MediaPreview = memo<MediaPreviewProps>(
  ({
    url,
    type,
    alt = "Media preview",
    aspectRatio = "square",
    lazy = true,
    className,
    objectFit = "cover",
    showControls = false,
  }) => {
    const objectFitClass =
      objectFit === "cover"
        ? "object-cover"
        : objectFit === "contain"
          ? "object-contain"
          : "object-fill";

    const containerClass = clsx(
      "bg-gray-100 rounded-lg overflow-hidden",
      aspectRatioStyles[aspectRatio],
      className
    );

    if (type === "image") {
      return (
        <div className={containerClass}>
          <img
            src={url}
            alt={alt}
            className={clsx("w-full h-full", objectFitClass)}
            loading={lazy ? "lazy" : undefined}
            draggable={false}
          />
        </div>
      );
    }

    if (type === "video") {
      return (
        <div className={containerClass}>
          <video
            src={url}
            className={clsx("w-full h-full", objectFitClass)}
            controls={showControls}
            preload="metadata"
            draggable={false}
          />
        </div>
      );
    }

    // Document or unknown type - show icon placeholder
    const IconComponent = type === "document" ? FileText : ImageIcon;

    return (
      <div className={clsx(containerClass, "flex items-center justify-center")}>
        <IconComponent className="w-12 h-12 text-gray-400" />
      </div>
    );
  }
);

MediaPreview.displayName = "MediaPreview";

/**
 * Helper function to determine media type from a type string
 */
export function getMediaPreviewType(type: string): MediaPreviewType {
  const normalizedType = type.toUpperCase();
  switch (normalizedType) {
    case "IMAGE":
    case "LOGO":
    case "BANNER":
      return "image";
    case "VIDEO":
      return "video";
    default:
      return "unknown";
  }
}

export default MediaPreview;
