"use client";

import { NAV_OPTIONS } from "@/data/navigation";
import clsx from "clsx";
import { useState } from "react";
import Logo from "./branding/Logo";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { Iconify } from "./ui/Iconify";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleScroll = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
    };

    return (
        <div className="mx-auto fixed top-4 left-0 right-0 z-50 max-w-7xl px-4 w-full">
            <Card padding="px-4 py-2" width="w-full">
                <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                        <Logo />

                        <div className="hidden md:flex items-center">
                            {NAV_OPTIONS.map((option) => (
                                <Button
                                    key={option.id}
                                    variant="ghost"
                                    onClick={(e) => handleScroll(e, option.id)}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>

                        <MenuButton
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                        />
                    </div>

                    <div
                        className={clsx(
                            "grid transition-all duration-300 md:hidden",
                            isMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        )}
                    >
                        <div className="overflow-hidden">
                            <div className="flex flex-col items-center gap-4 w-full py-4">
                                {NAV_OPTIONS.map((option) => (
                                    <Button
                                        key={option.id}
                                        variant="ghost"
                                        onClick={(e) =>
                                            handleScroll(e, option.id)
                                        }
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

const MenuButton = ({
    isMenuOpen,
    setIsMenuOpen,
}: {
    isMenuOpen: boolean;
    setIsMenuOpen: (isMenuOpen: boolean) => void;
}) => {
    return (
        <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="block md:hidden relative w-8 h-8"
        >
            <Iconify
                icon="mdi:menu"
                className={clsx(
                    "absolute inset-0 transition-all duration-300 text-3xl text-content/50",
                    isMenuOpen && "opacity-0 rotate-90"
                )}
            />

            <Iconify
                icon="mdi:close"
                className={clsx(
                    "absolute inset-0 transition-all duration-300 text-3xl text-content/50",
                    !isMenuOpen && "opacity-0 -rotate-90"
                )}
            />
        </button>
    );
};
