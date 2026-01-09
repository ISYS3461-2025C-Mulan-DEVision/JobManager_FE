import React from "react";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { Check } from "lucide-react";
import clsx from "clsx";
import type { SubscriptionPlan } from "../types";

export interface SubscriptionPlanCardProps {
    plan: SubscriptionPlan;
    isCurrentPlan?: boolean;
    isPopular?: boolean;
    onSelect?: (planId: string) => void;
    disabled?: boolean;
}

export const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
    plan,
    isCurrentPlan = false,
    isPopular = false,
    onSelect,
    disabled = false,
}) => {
    const handleSelect = () => {
        if (onSelect && !disabled && !isCurrentPlan) {
            onSelect(plan.id);
        }
    };

    return (
        <Card
            className={clsx(
                "relative flex flex-col h-full",
                isPopular && "border-2 border-blue-500 shadow-lg",
                isCurrentPlan && "border-2 border-green-500"
            )}
            padding="lg"
        >

            {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                    </span>
                </div>
            )}


            {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Current Plan
                    </span>
                </div>
            )}

    
            <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
            </div>

            <div className="mb-6">
                <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                        {plan.currency === "USD" ? "$" : plan.currency}
                        {plan.price}
                    </span>
                    <span className="text-gray-500 ml-2">
                        /{plan.billingPeriod === "MONTHLY" ? "month" : "year"}
                    </span>
                </div>
            </div>

            <div className="flex-grow mb-6">
                <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>


            <Button
                variant={isPopular ? "primary" : "outline"}
                fullWidth
                onClick={handleSelect}
                disabled={disabled || isCurrentPlan}
            >
                {isCurrentPlan ? "Current Plan" : "Select Plan"}
            </Button>
        </Card>
    );
};
