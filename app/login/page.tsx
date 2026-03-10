"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && phone && password) {
            login(name, phone, password);
            router.push("/");
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex bg-surface-bg">
            {/* Decorative Left Panel */}
            <div className="hidden lg:flex w-1/2 bg-surface-container relative overflow-hidden flex-col items-center justify-center p-12">
                <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary rounded-full blur-3xl opacity-15 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-primary rounded-full blur-3xl opacity-15 translate-x-1/2 translate-y-1/2" />

                <div className="relative z-10 text-center max-w-lg">
                    <h1 className="text-4xl font-bold text-brand-primary mb-6">Welcome back to EcoRide</h1>
                    <p className="text-text-secondary text-lg">Your trusted community for intercity carpooling. Log in to continue your journey.</p>
                </div>
            </div>

            {/* Form Right Panel */}
            <div className="w-full lg:w-1/2 flex flex-col px-6 py-8 md:px-16 md:py-16">


                <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center pb-20">

                    <div className="animate-in slide-in-from-right-8 fade-in duration-300 relative">
                        <h2 className="text-3xl font-bold text-text-primary mb-2">Log in</h2>
                        <p className="text-text-secondary mb-8">Enter your details to login.</p>

                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full h-14 bg-surface-low border-b-2 border-surface-outline rounded-t-xl px-4 text-text-primary outline-none focus:border-brand-primary"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Phone number (+91...)"
                                    className="w-full h-14 bg-surface-low border-b-2 border-surface-outline rounded-t-xl px-4 text-text-primary outline-none focus:border-brand-primary"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full h-14 bg-surface-low border-b-2 border-surface-outline rounded-t-xl px-4 text-text-primary outline-none focus:border-brand-primary"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>


                            <Button type="submit" size="lg" className="w-full h-14 text-lg">
                                Log in
                            </Button>

                       

                            <p className="text-center mt-6 text-text-secondary">
                                Not a member yet? <Link href="/register" className="text-brand-primary font-medium hover:underline">Sign up</Link>
                            </p>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
