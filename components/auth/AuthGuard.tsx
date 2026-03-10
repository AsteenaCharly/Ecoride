"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Paths that don't require authentication
        const publicPaths = ["/login", "/register"];

        if (!user && !publicPaths.includes(pathname)) {
            router.push("/login");
        }
    }, [user, pathname, router]);

    // If not logged in and not on a public path, show nothing while redirecting
    if (!user && !["/login", "/register"].includes(pathname)) {
        return <div className="min-h-screen bg-surface-bg" />;
    }

    return <>{children}</>;
}
