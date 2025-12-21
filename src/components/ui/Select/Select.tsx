import React from "react";
import clsx from "clsx";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  options,
  className,
  id,
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={clsx("flex flex-col gap-1", fullWidth && "w-full")}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
          "text-gray-900 bg-white",
          "appearance-none cursor-pointer",
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
          props.disabled && "bg-gray-100 cursor-not-allowed",
          className
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
          paddingRight: "2.5rem",
        }}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-red-600">{error}</span>}
      {helperText && !error && (
        <span className="text-sm text-gray-500">{helperText}</span>
      )}
    </div>
  );
};
