import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "tonal"
    size?: "default" | "sm" | "lg" | "icon"
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-brand-primary text-text-onprimary hover:bg-brand-primary90 shadow-sm": variant === "default",
                        "border-2 border-surface-outline bg-transparent hover:bg-surface-low text-text-primary text-brand-primary": variant === "outline",
                        "hover:bg-brand-primary10 text-brand-primary": variant === "ghost",
                        "bg-surface-container text-brand-primary hover:bg-surface-low": variant === "tonal",

                        "h-10 px-4 py-2": size === "default",
                        "h-9 px-3": size === "sm",
                        "h-14 px-8 text-base": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
