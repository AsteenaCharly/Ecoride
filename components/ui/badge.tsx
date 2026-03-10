import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "filled" | "outline" | "secondary"
}

function Badge({ className, variant = "filled", ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
                {
                    "bg-brand-primary text-text-onprimary": variant === "filled",
                    "border border-brand-primary text-brand-primary": variant === "outline",
                    "bg-surface-low text-text-secondary": variant === "secondary",
                },
                className
            )}
            {...props}
        />
    )
}

export { Badge }
