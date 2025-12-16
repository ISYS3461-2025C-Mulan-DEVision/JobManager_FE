import React from "react";
import { Card } from "../../ui/Card/Card";
import { Button } from "../../ui/Button/Button"; // Assuming Button exists

interface PremiumBannerProps {
    status: "FREE" | "PREMIUM" | "EXPIRING" | "EXPIRED";
    daysRemaining?: number;
    onUpgrade: () => void;
}

export const PremiumBanner: React.FC<PremiumBannerProps> = ({
    status,
    daysRemaining,
    onUpgrade,
}) => {
    if (
        status === "PREMIUM" &&
        (daysRemaining === undefined || daysRemaining > 7)
    ) {
        return null; // Don't show if healthy premium
    }

    const config = {
        FREE: {
            title: "Upgrade to Premium",
            message:
                "Unlock advanced analytics, unlimited job posts, and priority support.",
            buttonText: "Upgrade Now",
            bg: "bg-gradient-to-r from-indigo-500 to-purple-600",
            textColor: "text-white",
        },
        EXPIRING: {
            title: `Subscription Expiring in ${daysRemaining} Days`,
            message: "Renew now to keep your premium benefits active.",
            buttonText: "Renew Subscription",
            bg: "bg-yellow-50 border-l-4 border-yellow-400",
            textColor: "text-yellow-800",
        },
        EXPIRED: {
            title: "Subscription Expired",
            message:
                "Your premium features are currently disabled. Reactivate to restore access.",
            buttonText: "Reactivate Now",
            bg: "bg-red-50 border-l-4 border-red-400",
            textColor: "text-red-800",
        },
        PREMIUM: {
            // Fallback
            title: "",
            message: "",
            buttonText: "",
            bg: "",
            textColor: "",
        },
    };

    const currentConfig = config[status];

    if (status === "FREE") {
        return (
            <div
                className={`rounded-lg shadow-md p-6 ${currentConfig.bg} ${currentConfig.textColor} mb-6`}
            >
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-bold">
                            {currentConfig.title}
                        </h3>
                        <p className="mt-1 opacity-90">
                            {currentConfig.message}
                        </p>
                    </div>
                    <button
                        onClick={onUpgrade}
                        className="bg-white text-indigo-600 font-semibold py-2 px-6 rounded-md shadow hover:bg-gray-100 transition-colors"
                    >
                        {currentConfig.buttonText}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-4 rounded-md ${currentConfig.bg} mb-6`}>
            <div className="flex justify-between items-center">
                <div className="flex">
                    <div className="ml-3">
                        <h3
                            className={`text-sm font-medium ${currentConfig.textColor}`}
                        >
                            {currentConfig.title}
                        </h3>
                        <div
                            className={`mt-2 text-sm ${currentConfig.textColor} opacity-90`}
                        >
                            <p>{currentConfig.message}</p>
                        </div>
                    </div>
                </div>
                <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                        <button
                            onClick={onUpgrade}
                            className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                status === "EXPIRING"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500"
                                    : "bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500"
                            }`}
                        >
                            {currentConfig.buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
