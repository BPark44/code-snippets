import { ThemedText as Text } from "@/components/ThemedText";
import clsx from "clsx";
import React, { ReactNode } from "react";
import { ActivityIndicator, Pressable } from "react-native";

type Props = {
    onPress: () => void;
    children: ReactNode;
    isDisabled?: boolean;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
    variant?: "primary" | "secondary";
    loading?: boolean;
};

export default function Button({
    onPress,
    children,
    isDisabled,
    icon,
    iconPosition = "left",
    variant = "primary",
    loading = false,
}: Props) {
    return (
        <Pressable
            className={clsx(
                "w-full h-14 rounded-full flex-row gap-3 items-center justify-center text-white",
                variant === "primary" && "bg-[#4B5119]",
                variant === "secondary" &&
                    "bg-white border border-[#4B5119] text-[#4B5119]",
                (isDisabled || loading) && "opacity-50"
            )}
            onPress={onPress}
            disabled={isDisabled || loading}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === "secondary" ? "#4B5119" : "#FFFFFF"}
                    size="small"
                />
            ) : (
                <>
                    {icon && iconPosition === "left" && icon}
                    <Text
                        className="text-base font-semibold"
                        lightColor="#FFFFFF"
                        darkColor="#FFFFFF"
                        style={{
                            color:
                                variant === "secondary" ? "#000000" : "#FFFFFF",
                        }}
                    >
                        {children}
                    </Text>
                    {icon && iconPosition === "right" && icon}
                </>
            )}
        </Pressable>
    );
}
