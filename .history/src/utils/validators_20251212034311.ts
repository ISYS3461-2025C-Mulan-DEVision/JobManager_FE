// Common validation functions

export const validators = {
    email: (value: string): string | undefined => {
        if (!value) return "Email is required";
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            return "Invalid email address";
        }
        return undefined;
    },

    password: (value: string, minLength: number = 6): string | undefined => {
        if (!value) return "Password is required";
        if (value.length < minLength) {
            return `Password must be at least ${minLength} characters`;
        }
        return undefined;
    },

    required: (value: any, fieldName: string = "This field"): string | undefined => {
        if (!value || (typeof value === "string" && !value.trim())) {
            return `${fieldName} is required`;
        }
        return undefined;
    },

    minLength: (value: string, min: number, fieldName: string = "Value"): string | undefined => {
        if (value && value.length < min) {
            return `${fieldName} must be at least ${min} characters`;
        }
        return undefined;
    },

    maxLength: (value: string, max: number, fieldName: string = "Value"): string | undefined => {
        if (value && value.length > max) {
            return `${fieldName} must not exceed ${max} characters`;
        }
        return undefined;
    },

    url: (value: string): string | undefined => {
        if (!value) return undefined;
        try {
            new URL(value);
            return undefined;
        } catch {
            return "Invalid URL";
        }
    },

    phone: (value: string): string | undefined => {
        if (!value) return undefined;
        if (!/^[\d\s\-\+\(\)]+$/.test(value)) {
            return "Invalid phone number";
        }
        return undefined;
    },
};

// Compose multiple validators
export const composeValidators = (...validators: Array<(value: any) => string | undefined>) => {
    return (value: any): string | undefined => {
        for (const validator of validators) {
            const error = validator(value);
            if (error) return error;
        }
        return undefined;
    };
};
