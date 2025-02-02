"use client";

import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

// Define variant types
type ButtonVariant = "ghost";

// Add icon position type
type IconPosition = "left" | "right";

// Add size type
type ButtonSize = "small" | "large";

type ButtonProps = {
    children: string | ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: ReactNode;
    iconPosition?: IconPosition;
    isLoading?: boolean;
    loaderColor?: string;
    isDisabled?: boolean;
    width?: string;
    padding?: string;
    textSize?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

// Base button classes
const baseButtonClasses =
    "h-fit rounded-xl font-normal text-center flex justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg select-none";

// Variant classes mapping
const variantClasses: Record<ButtonVariant, string> = {
    ghost: "bg-transparent text-white",
};

// Add size classes mapping
const sizeClasses: Record<ButtonSize, string> = {
    small: "py-2 px-4 text-[12px]",
    large: "py-3 px-6 text-[16px]",
};

export default function Button({
    children,
    variant = "primary",
    size = "large",
    icon,
    iconPosition = "left",
    isLoading = false,
    loaderColor = "text-current",
    isDisabled = false,
    width = "w-fit",
    padding,
    textSize,
    className,
    ...props
}: ButtonProps) {
    const content = (
        <>
            {isLoading ? (
                <span
                    className={clsx(
                        loaderColor,
                        "flex items-center justify-center loading loading-ring loading-sm"
                    )}
                ></span>
            ) : (
                <div className="flex items-center gap-2">
                    {icon && iconPosition === "left" && icon}
                    {children}
                    {icon && iconPosition === "right" && icon}
                </div>
            )}
        </>
    );

    return (
        <button
            className={clsx(
                baseButtonClasses,
                sizeClasses[size],
                variantClasses[variant],
                width,
                padding,
                textSize,
                {
                    "cursor-not-allowed opacity-50": isDisabled,
                },
                className
            )}
            disabled={isDisabled}
            {...props}
        >
            {content}
        </button>
    );
}
