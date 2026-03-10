"use client";

import Link from "next/link";
import { Car } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();
    if (pathname === "/login" || pathname === "/register") {
        return null;
    }
    return (
        <footer className="bg-surface-container py-12 md:py-16 mt-20 border-t border-surface-outline/10 mb-16 md:mb-0">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Car className="text-brand-primary h-6 w-6" />
                            <span className="text-xl font-bold text-brand-primary">EcoRide</span>
                        </Link>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            Share the ride, share the road. The most reliable and affordable intercity carpooling network.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-text-primary mb-4">Top carpool routes</h4>
                        <ul className="space-y-3 text-sm text-text-secondary">
                            <li><Link href="/rides?from=Mumbai&to=Pune" className="hover:text-brand-primary">Mumbai → Pune</Link></li>
                            <li><Link href="/rides?from=Delhi&to=Agra" className="hover:text-brand-primary">Delhi → Agra</Link></li>
                            <li><Link href="/rides?from=Bangalore&to=Mysore" className="hover:text-brand-primary">Bangalore → Mysore</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-text-primary mb-4">About</h4>
                        <ul className="space-y-3 text-sm text-text-secondary">
                            <li><Link href="/how-it-works" className="hover:text-brand-primary">How it works</Link></li>
                            <li><Link href="#" className="hover:text-brand-primary">About us</Link></li>
                            <li><Link href="#" className="hover:text-brand-primary">Help centre</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-text-primary mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm text-text-secondary">
                            <li><Link href="#" className="hover:text-brand-primary">Terms and Conditions</Link></li>
                            <li><Link href="#" className="hover:text-brand-primary">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-brand-primary">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-surface-outline/10 text-center text-sm text-text-secondary/70">
                    <p>© {new Date().getFullYear()} EcoRide Clone. Mock Build.</p>
                </div>
            </div>
        </footer>
    );
}
