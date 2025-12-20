import React from "react";
import clsx from "clsx";
import { Building2, Image, ShieldCheck, Bell, CreditCard } from "lucide-react";
import type { ProfileSection } from "./types";

interface SidebarItem {
    id: ProfileSection;
    label: string;
    icon: React.ReactNode;
    disabled?: boolean;
    comingSoon?: boolean;
}

interface CompanyProfileSidebarProps {
    activeSection: ProfileSection;
    onSectionChange: (section: ProfileSection) => void;
    className?: string;
}

const sidebarItems: SidebarItem[] = [
    {
        id: "company-info",
        label: "Company Information",
        icon: <Building2 className="w-5 h-5" />,
    },
    {
        id: "media-showcase",
        label: "Media & Showcase",
        icon: <Image className="w-5 h-5" />,
    },
    {
        id: "account-security",
        label: "Account & Security",
        icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
        id: "notifications",
        label: "Notifications",
        icon: <Bell className="w-5 h-5" />,
        disabled: true,
        comingSoon: true,
    },
    {
        id: "payment-subscription",
        label: "Payment & Subscription",
        icon: <CreditCard className="w-5 h-5" />,
        disabled: true,
        comingSoon: true,
    },
];

export const CompanyProfileSidebar: React.FC<CompanyProfileSidebarProps> = ({
    activeSection,
    onSectionChange,
    className,
}) => {
    return (
        <nav className={clsx("w-64 bg-white border-r border-gray-200 min-h-full", className)}>
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>
                <ul className="space-y-1">
                    {sidebarItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => !item.disabled && onSectionChange(item.id)}
                                disabled={item.disabled}
                                className={clsx(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                                    activeSection === item.id
                                        ? "bg-blue-50 text-blue-700 font-medium cursor-pointer"
                                        : item.disabled
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                                )}
                            >
                                <span className={clsx(
                                    activeSection === item.id
                                        ? "text-blue-600"
                                        : item.disabled
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                )}>
                                    {item.icon}
                                </span>
                                <span className="flex-1">{item.label}</span>
                                {item.comingSoon && (
                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                        Soon
                                    </span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default CompanyProfileSidebar;
