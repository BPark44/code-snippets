import { Icon, IconifyIcon } from "@iconify/react";
import { BaseHTMLAttributes } from "react";

export interface IconifyProps extends BaseHTMLAttributes<HTMLSpanElement> {
    icon: IconifyIcon | string;
}

export function Iconify({ icon, ...other }: IconifyProps) {
    return (
        <span {...other}>
            {/* Find icons here -> https://icon-sets.iconify.design/ */}
            <Icon icon={icon} />
        </span>
    );
}
