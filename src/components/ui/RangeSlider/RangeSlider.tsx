import React, { useState } from "react";
import clsx from "clsx";

export interface RangeSliderProps {
    label?: string;
    min: number;
    max: number;
    step?: number;
    minValue: number;
    maxValue: number;
    onMinChange: (value: number) => void;
    onMaxChange: (value: number) => void;
    formatValue?: (value: number) => string;
    className?: string;
    showInputs?: boolean;
    onApply?: () => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
    label,
    min,
    max,
    step = 1,
    minValue,
    maxValue,
    onMinChange,
    onMaxChange,
    formatValue = (v) => v.toString(),
    className,
    showInputs = true,
    onApply,
}) => {
    const [localMin, setLocalMin] = useState(minValue);
    const [localMax, setLocalMax] = useState(maxValue);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value <= localMax) {
            setLocalMin(value);
        }
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value >= localMin) {
            setLocalMax(value);
        }
    };

    // Input change handlers - available for future use with number inputs
    // const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = Number(e.target.value);
    //     if (!isNaN(value) && value >= min && value <= localMax) {
    //         setLocalMin(value);
    //     }
    // };

    // const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = Number(e.target.value);
    //     if (!isNaN(value) && value <= max && value >= localMin) {
    //         setLocalMax(value);
    //     }
    // };

    const handleApply = () => {
        onMinChange(localMin);
        onMaxChange(localMax);
        onApply?.();
    };

    // Calculate the left and width for the range highlight
    const leftPercent = ((localMin - min) / (max - min)) * 100;
    const widthPercent = ((localMax - localMin) / (max - min)) * 100;

    return (
        <div className={clsx("flex flex-col gap-2", className)}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <div className="relative pt-1">
                {/* Track background */}
                <div className="h-2 bg-gray-200 rounded-full" />

                {/* Active range highlight */}
                <div
                    className="absolute top-1 h-2 bg-blue-500 rounded-full"
                    style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                    }}
                />

                {/* Min slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={localMin}
                    onChange={handleMinChange}
                    className="absolute top-0 w-full h-4 appearance-none bg-transparent pointer-events-auto cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                />

                {/* Max slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={localMax}
                    onChange={handleMaxChange}
                    className="absolute top-0 w-full h-4 appearance-none bg-transparent pointer-events-auto cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                />
            </div>

            {showInputs && (
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-600">Salary:</span>
                    <span className="text-sm font-medium">
                        ${formatValue(localMin)} - ${formatValue(localMax)}
                    </span>
                    {onApply && (
                        <button
                            onClick={handleApply}
                            className="ml-2 px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                        >
                            Apply
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
