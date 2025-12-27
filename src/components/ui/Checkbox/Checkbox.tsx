import React from "react";
import clsx from "clsx";

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    label,
    error,
    helperText,
    className,
    id,
    ...props
}) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className="flex flex-col gap-1">
            <label
                htmlFor={checkboxId}
                className={clsx(
                    "flex items-center gap-2 cursor-pointer",
                    props.disabled && "cursor-not-allowed opacity-50"
                )}
            >
                <input
                    id={checkboxId}
                    type="checkbox"
                    className={clsx(
                        "w-4 h-4 rounded border-gray-300 text-blue-600",
                        "focus:ring-2 focus:ring-blue-500 focus:ring-offset-0",
                        "transition-colors cursor-pointer",
                        error && "border-red-500",
                        props.disabled && "cursor-not-allowed",
                        className
                    )}
                    {...props}
                />
                {label && (
                    <span className="text-sm text-gray-700">{label}</span>
                )}
            </label>
            {error && <span className="text-sm text-red-600">{error}</span>}
            {helperText && !error && (
                <span className="text-sm text-gray-500">{helperText}</span>
            )}
        </div>
    );
};
