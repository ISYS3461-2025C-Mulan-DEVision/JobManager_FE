import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { ArrowLeft, Shield, Lock, CreditCard, ExternalLink, Loader2 } from "lucide-react";
import type { PaymentGateway as PaymentGatewayType, SubscriptionConfirmation } from "../types";

interface PaymentGatewayProps {
    confirmation: SubscriptionConfirmation;
    gateway?: PaymentGatewayType;
    clientSecret?: string;
    paymentIntentId?: string;
    onPaymentComplete: (success: boolean, transactionId?: string) => void;
    onBack: () => void;
    onCancel: () => void;
    isProcessing?: boolean;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
    confirmation,
    gateway = "stripe",
    clientSecret,
    paymentIntentId,
    onPaymentComplete,
    onBack,
    onCancel,
    isProcessing = false,
}) => {
    const [isRedirecting, setIsRedirecting] = useState(true);
    const [showEmbedded, setShowEmbedded] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        // If we have a real client secret, show the form immediately
        // Otherwise simulate redirect delay for demo
        if (clientSecret) {
            setIsRedirecting(false);
            setShowEmbedded(true);
        } else {
            const timer = setTimeout(() => {
                setIsRedirecting(false);
                setShowEmbedded(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [clientSecret]);

    // Handle payment with Stripe integration
    const handleMockPayment = async (success: boolean) => {
        setIsSimulating(true);

        // In production with real Stripe integration:
        // 1. Use stripe.confirmPayment() with the clientSecret
        // 2. Handle the result and redirect or show error
        // For now, simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const transactionId = success ? paymentIntentId || `txn_${Date.now()}` : undefined;
        setIsSimulating(false);
        onPaymentComplete(success, transactionId);
    };

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
        }).format(price);
    };

    const isButtonDisabled = isProcessing || isSimulating;

    return (
        <div className="max-w-xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    onClick={onBack}
                    disabled={isRedirecting || isButtonDisabled}
                >
                    Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Secure Payment</h1>
                    <p className="text-sm text-gray-500">
                        Complete your subscription via {gateway === "stripe" ? "Stripe" : "PayPal"}
                    </p>
                </div>
            </div>

            {/* Loading / Redirect State */}
            {isRedirecting && (
                <Card padding="lg" className="text-center">
                    <div className="py-12">
                        {/* Stripe Logo */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-indigo-600 rounded-lg p-4">
                                <svg
                                    className="w-16 h-8 text-white"
                                    viewBox="0 0 60 25"
                                    fill="currentColor"
                                >
                                    <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a10.3 10.3 0 01-4.56.95c-4.01 0-6.83-2.5-6.83-7.28 0-4.19 2.39-7.34 6.18-7.34 3.72 0 6.06 2.93 6.06 7.15 0 .6-.04 1.25-.04 1.6zm-6.08-5.86c-1.2 0-2.1.94-2.26 2.6h4.38c0-1.59-.78-2.6-2.12-2.6zM40.95 20.3V5.92l4.12-.67v15.06h-4.12zm0-19.47l4.12-.7v3.59l-4.12.66V.83zm-5.17 7.52v11.96h-4.12V8.79c0-2.05-.42-2.92-1.54-2.92-.95 0-1.76.59-2.44 1.48v12.95h-4.12V.82l4.12-.66v5.49A5.24 5.24 0 0131.72 4c2.33 0 4.06 1.6 4.06 5.35zM19.1 4c2.33 0 4.06 1.6 4.06 5.35v11.96h-4.12V8.79c0-2.05-.42-2.92-1.54-2.92-.95 0-1.76.59-2.44 1.48v12.95H10.9V.82l4.12-.66v5.49A5.24 5.24 0 0119.06 4zM6.69 7.87c-1.38 0-2.52.89-2.52 2.06 0 1.23 1.04 1.74 2.6 2.37 2.48 1 4.3 2.1 4.3 4.9 0 3.13-2.48 5.24-6 5.24-1.76 0-3.72-.54-5.07-1.48V16.9c1.6 1.08 3.5 1.74 5.07 1.74 1.44 0 2.14-.6 2.14-1.62 0-1.17-.84-1.74-2.65-2.43C2.17 13.6 0 12.4 0 9.67 0 6.4 2.65 4 6.58 4c1.38 0 3.04.37 4.12.84v4.02c-1.22-.77-2.93-1-4.01-1z" />
                                </svg>
                            </div>
                        </div>

                        {/* Loading Spinner */}
                        <div className="flex justify-center mb-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Redirecting to secure payment...
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Please wait while we securely connect you to our payment provider
                        </p>

                        {/* Security Badge */}
                        <div className="flex items-center justify-center gap-2 mt-6 text-gray-400">
                            <Lock className="w-4 h-4" />
                            <span className="text-xs">256-bit SSL Encrypted</span>
                        </div>
                    </div>
                </Card>
            )}

            {/* Embedded Checkout (Mock) */}
            {showEmbedded && (
                <>
                    {/* Order Summary */}
                    <Card padding="md" className="bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">You're paying for</p>
                                <p className="font-semibold text-gray-900">
                                    {confirmation.planName}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatPrice(confirmation.price, confirmation.currency)}
                                </p>
                                <p className="text-xs text-gray-500">per month</p>
                            </div>
                        </div>
                    </Card>

                    {/* Stripe Checkout Embed (Simulated) */}
                    <Card padding="none" className="overflow-hidden border-2 border-gray-200">
                        {/* Stripe Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="bg-indigo-600 rounded p-1">
                                        <svg
                                            className="w-6 h-3 text-white"
                                            viewBox="0 0 60 25"
                                            fill="currentColor"
                                        >
                                            <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a10.3 10.3 0 01-4.56.95c-4.01 0-6.83-2.5-6.83-7.28 0-4.19 2.39-7.34 6.18-7.34 3.72 0 6.06 2.93 6.06 7.15 0 .6-.04 1.25-.04 1.6zm-6.08-5.86c-1.2 0-2.1.94-2.26 2.6h4.38c0-1.59-.78-2.6-2.12-2.6z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        Powered by Stripe
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-green-600">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-xs font-medium">Secure</span>
                                </div>
                            </div>
                        </div>

                        {/* Mock Payment Form Area */}
                        <div className="p-6 bg-white">
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <CreditCard className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Stripe Checkout
                                </h3>
                                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                                    {clientSecret ? (
                                        <>
                                            Payment intent created. In production, Stripe Elements
                                            would handle the card input.
                                        </>
                                    ) : (
                                        <>
                                            In production, Stripe's secure payment form would be
                                            embedded here. For demo purposes, use the buttons below.
                                        </>
                                    )}
                                </p>

                                {/* Payment Intent Info */}
                                {paymentIntentId && (
                                    <div className="mb-4 text-xs text-gray-400">
                                        Payment ID: {paymentIntentId.substring(0, 20)}...
                                    </div>
                                )}

                                {/* Mock Payment Actions */}
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleMockPayment(true)}
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={isButtonDisabled}
                                    >
                                        {isSimulating ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Simulate Successful Payment"
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleMockPayment(false)}
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                        disabled={isButtonDisabled}
                                    >
                                        Simulate Failed Payment
                                    </Button>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <p className="text-xs text-gray-500 text-center mb-3">
                                    Accepted payment methods
                                </p>
                                <div className="flex justify-center gap-3">
                                    <div className="bg-gray-100 rounded px-3 py-1">
                                        <svg className="h-6 w-10" viewBox="0 0 50 30">
                                            <rect fill="#1A1F71" width="50" height="30" rx="4" />
                                            <text
                                                fill="white"
                                                fontSize="10"
                                                fontWeight="bold"
                                                x="25"
                                                y="18"
                                                textAnchor="middle"
                                            >
                                                VISA
                                            </text>
                                        </svg>
                                    </div>
                                    <div className="bg-gray-100 rounded px-3 py-1">
                                        <svg className="h-6 w-10" viewBox="0 0 50 30">
                                            <rect
                                                fill="#EB001B"
                                                cx="18"
                                                cy="15"
                                                width="50"
                                                height="30"
                                                rx="4"
                                            />
                                            <circle
                                                fill="#F79E1B"
                                                cx="32"
                                                cy="15"
                                                r="10"
                                                opacity="0.8"
                                            />
                                            <text
                                                fill="white"
                                                fontSize="6"
                                                fontWeight="bold"
                                                x="25"
                                                y="17"
                                                textAnchor="middle"
                                            >
                                                MC
                                            </text>
                                        </svg>
                                    </div>
                                    <div className="bg-gray-100 rounded px-3 py-1">
                                        <svg className="h-6 w-10" viewBox="0 0 50 30">
                                            <rect fill="#006FCF" width="50" height="30" rx="4" />
                                            <text
                                                fill="white"
                                                fontSize="8"
                                                fontWeight="bold"
                                                x="25"
                                                y="18"
                                                textAnchor="middle"
                                            >
                                                AMEX
                                            </text>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Your payment info is encrypted</span>
                                <a
                                    href="#"
                                    className="flex items-center gap-1 text-indigo-600 hover:underline"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    Learn more
                                </a>
                            </div>
                        </div>
                    </Card>

                    {/* Cancel Option */}
                    <div className="text-center">
                        <Button variant="ghost" onClick={onCancel} className="text-gray-500">
                            Cancel and return to pricing
                        </Button>
                    </div>
                </>
            )}

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-8 text-gray-400 text-xs pt-4">
                <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>PCI Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    <span>SSL Secured</span>
                </div>
            </div>
        </div>
    );
};
