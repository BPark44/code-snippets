"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

interface FadeInProps {
    children: React.ReactNode;
    duration?: number; // delay in milliseconds
    className?: string;
}

export default function FadeIn({
    children,
    duration = 0,
    className,
}: FadeInProps) {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true);
                    }, duration);
                }
            },
            {
                threshold: 0.1, // Trigger when 10% of element is visible
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [duration]);

    return (
        <div
            ref={elementRef}
            className={clsx(
                "transition-all duration-700 ease-out",
                isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8",
                className
            )}
        >
            {children}
        </div>
    );
}
