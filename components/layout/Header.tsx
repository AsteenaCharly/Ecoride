"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, PlusCircle, SearchIcon, Car, UserCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store/auth";

export function Header() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-surface-bg border-b border-surface-outline/10 h-16 flex items-center shadow-sm">
                <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Car className="text-brand-primary h-6 w-6" />
                        <span className="text-xl font-bold text-brand-primary">EcoRide</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/rides" className="text-sm font-medium text-text-primary hover:text-brand-primary flex items-center gap-2">
                            <SearchIcon className="h-4 w-4" /> Search
                        </Link>
                        <Link href="/rides/publish" className="text-sm font-medium text-text-primary hover:text-brand-primary flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" /> Publish
                        </Link>
                        <Link href="/bookings" className="text-sm font-medium text-text-primary hover:text-brand-primary">
                            My Bookings
                        </Link>
                        <Link href="/dashboard" className="text-sm font-medium text-text-primary hover:text-brand-primary">
                            Dashboard
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="hidden md:flex items-center gap-3">
                                    <span className="text-sm font-medium text-text-primary">Hello, {user.name.split(' ')[0]}</span>
                                    <Link href={`/profile/${user.id || 'u1'}`}>
                                        <Avatar src={user.avatarUrl} alt={user.name} size="sm" className="border border-surface-outline/20 hover:ring-2 ring-brand-primary cursor-pointer transition-all" />
                                    </Link>
                                </div>
                                <div className="md:hidden">
                                    <Link href={`/profile/${user.id || 'u1'}`}>
                                        <Avatar src={user.avatarUrl} alt={user.name} size="sm" className="border border-surface-outline/20 hover:ring-2 ring-brand-primary cursor-pointer transition-all" />
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <Link href="/login">
                                <Button variant="ghost" className="rounded-full">Log in</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-bg border-t border-surface-outline/10 pb-safe">
                <nav className="flex items-center justify-around h-16 px-2">
                    <MobileNavLink href="/" icon={<Search className="h-5 w-5" />} label="Home" active={pathname === "/"} />
                    <MobileNavLink href="/rides" icon={<SearchIcon className="h-5 w-5" />} label="Search" active={pathname === "/rides"} />
                    <MobileNavLink href="/rides/publish" icon={<PlusCircle className="h-5 w-5" />} label="Publish" active={pathname === "/rides/publish"} />
                    <MobileNavLink href="/bookings" icon={<Car className="h-5 w-5" />} label="Bookings" active={pathname === "/bookings"} />
                    {user ? (
                        <MobileNavLink href={`/profile/${user.id || 'u1'}`} icon={<UserCircle2 className="h-5 w-5" />} label="Profile" active={pathname.startsWith("/profile")} />
                    ) : (
                        <MobileNavLink href="/login" icon={<UserCircle2 className="h-5 w-5" />} label="Login" active={pathname === "/login"} />
                    )}
                </nav>
            </div>
        </>
    );
}

function MobileNavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
    return (
        <Link
            href={href}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active ? "text-brand-primary" : "text-text-secondary hover:text-text-primary"
                }`}
        >
            <div className={`p-1 rounded-full ${active ? "bg-brand-primary10" : ""}`}>
                {icon}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
        </Link>
    );
}
