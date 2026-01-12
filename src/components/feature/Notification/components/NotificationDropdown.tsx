import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Notification } from "@/types/notification";
import { NotificationBell } from "@/components/ui/Notification";
import { NotificationPanel } from "./NotificationPanel";
import { useNotifications } from "../hooks/useNotifications";

interface NotificationDropdownProps {
    isPremium?: boolean;
    className?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
    isPremium = false,
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // Use fast polling for near real-time updates (every 3 seconds)
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications({
        autoRefresh: true,
        refreshInterval: 3000, // Poll every 3 seconds for near real-time
    });

    const handleToggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleViewAll = useCallback(() => {
        setIsOpen(false);
        navigate("/notifications");
    }, [navigate]);

    const handleUpgradeClick = useCallback(() => {
        setIsOpen(false);
        navigate("/subscription/plans");
    }, [navigate]);

    const handleNotificationClick = useCallback(
        (notification: Notification) => {
            // Mark as read
            markAsRead(notification.id);
            setIsOpen(false);

            // Navigate based on notification type
            if (notification.actionUrl) {
                navigate(notification.actionUrl);
            } else {
                // Default navigation based on type
                switch (notification.type) {
                    case "MATCH_ALERT":
                        if (notification.metadata.applicantId) {
                            navigate(`/applicant-search?id=${notification.metadata.applicantId}`);
                        }
                        break;
                    case "APPLICATION_RECEIVED":
                        if (notification.metadata.jobPostId) {
                            navigate(`/job-posts/${notification.metadata.jobPostId}/applications`);
                        }
                        break;
                    case "SUBSCRIPTION_WARNING":
                    case "SUBSCRIPTION_EXPIRED":
                        navigate("/subscription/plans");
                        break;
                    default:
                        // Stay on current page
                        break;
                }
            }
        },
        [navigate, markAsRead]
    );

    return (
        <div className={`relative ${className || ""}`}>
            <NotificationBell count={unreadCount} onClick={handleToggle} />

            <NotificationPanel
                isOpen={isOpen}
                onClose={handleClose}
                notifications={notifications}
                loading={loading}
                unreadCount={unreadCount}
                isPremium={isPremium}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onViewAll={handleViewAll}
                onNotificationClick={handleNotificationClick}
                onUpgradeClick={handleUpgradeClick}
                position="right"
            />
        </div>
    );
};
