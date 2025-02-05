import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

// Define variant types
type ButtonVariant = "primary";

// Add icon position type
type IconPosition = "left" | "right";

type ButtonProps = {
    children: string | ReactNode;
    variant?: ButtonVariant;
    icon?: ReactNode;
    iconPosition?: IconPosition;
    isLoading?: boolean;
    loaderColor?: string;
    isDisabled?: boolean;
    width?: string;
    padding?: string;
    textSize?: string;
    requiresSubscription?: boolean;
    isSubscribed?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

// Base button classes
const baseButtonClasses =
    "h-fit py-2.5 px-4 text-[14px] font-bold min-w-[100px] text-center flex justify-center transition-all duration-300";

// Variant classes mapping
const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-[rgb(124, 58, 237)] text-white group-[.not-disabled]:hover:opacity-90 rounded-full",
};

export default function Button({
    children,
    variant = "primary",
    icon,
    iconPosition = "left",
    isLoading = false,
    loaderColor = "text-current",
    isDisabled = false,
    width = "w-fit",
    padding,
    textSize,
    className,
    requiresSubscription = false,
    isSubscribed,
    ...props
}: ButtonProps) {
    return (
        <button
            className={clsx(
                baseButtonClasses,
                variantClasses[variant],
                width,
                padding,
                textSize,
                {
                    "cursor-not-allowed opacity-50": isDisabled,
                    "hover:scale-105 not-disabled": !isDisabled,
                },
                className
            )}
            disabled={isDisabled}
            {...props}
        >
            {children}
        </button>
    );
}
