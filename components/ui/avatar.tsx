import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string
    alt?: string
    fallback?: string
    size?: "sm" | "md" | "lg" | "xl"
    verified?: boolean
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, alt, fallback, size = "md", verified = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex shrink-0 overflow-hidden rounded-full bg-surface-low justify-center items-center",
                    {
                        "h-8 w-8 text-xs": size === "sm",
                        "h-12 w-12 text-sm": size === "md",
                        "h-16 w-16 text-base": size === "lg",
                        "h-24 w-24 text-xl": size === "xl",
                        "ring-2 ring-brand-primary ring-offset-2 ring-offset-surface-bg": verified,
                    },
                    className
                )}
                {...props}
            >
                {src ? (
                    <img
                        src={src}
                        alt={alt || "Avatar"}
                        className="aspect-square h-full w-full object-cover"
                    />
                ) : (
                    <span className="font-medium text-text-primary uppercase">
                        {fallback || alt?.charAt(0) || "U"}
                    </span>
                )}
            </div>
        )
    }
)
Avatar.displayName = "Avatar"

export { Avatar }
