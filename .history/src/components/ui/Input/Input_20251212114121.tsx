import React from "react";
import clsx from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    fullWidth = false,
    className,
    id,
    ...props
}) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className={clsx("flex flex-col gap-1", fullWidth && "w-full")}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={clsx(
                    "px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                    "text-gray-900 placeholder:text-gray-400",
                    error
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
                    props.disabled && "bg-gray-100 cursor-not-allowed",
                    className,
                )}
                {...props}
            />
            {error && <span className="text-sm text-red-600">{error}</span>}
            {helperText && !error && (
                <span className="text-sm text-gray-500">{helperText}</span>
            )}
        </div>
    );
};
