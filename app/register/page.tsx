"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuthStore(); // We'll just log them in for the mock

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState<"credentials" | "otp">("credentials");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    const handleCredentialsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone && password && name) {
            setStep("otp");
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value !== "" && index < 5) {
            const nextInput = document.getElementById(`reg-otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleRegister = () => {
        // For the demo, we just dump them into a logged-in state as the mock user
        login(phone, password);
        router.push("/");
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex bg-surface-bg">
            {/* Decorative Left Panel */}
            <div className="hidden lg:flex w-1/2 bg-surface-container relative overflow-hidden flex-col items-center justify-center p-12">
                <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary rounded-full blur-3xl opacity-15 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-primary rounded-full blur-3xl opacity-15 translate-x-1/2 translate-y-1/2" />

                <div className="relative z-10 text-center max-w-lg">
                    <h1 className="text-4xl font-bold text-brand-primary mb-6">Join EcoRide</h1>
                    <p className="text-text-secondary text-lg">The easiest way to share a ride across cities and save money.</p>
                </div>
            </div>

            {/* Form Right Panel */}
            <div className="w-full lg:w-1/2 flex flex-col px-6 py-8 md:px-16 md:py-16">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-text-primary hover:text-brand-primary mb-8 w-fit">
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>

                <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center pb-20">

          
                        <div className="animate-in slide-in-from-right-8 fade-in duration-300 relative">
                            <h2 className="text-3xl font-bold text-text-primary mb-2">Create an account</h2>
                            <p className="text-text-secondary mb-8">Fill in your details to get started.</p>

                            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
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
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full h-14 bg-surface-low border-b-2 border-surface-outline rounded-t-xl px-4 text-text-primary outline-none focus:border-brand-primary"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        placeholder="Create a Password"
                                        className="w-full h-14 bg-surface-low border-b-2 border-surface-outline rounded-t-xl px-4 text-text-primary outline-none focus:border-brand-primary"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                              <Link href="/login">
                                <Button type="submit" size="lg" className="w-full h-14 text-lg">
                                    Sign up
                                </Button>
                              </Link>
                             

                                <p className="text-center mt-6 text-text-secondary">
                                    Already have an account? <Link href="/login" className="text-brand-primary font-medium hover:underline">Log in</Link>
                                </p>
                            </form>
                        </div>
       

                </div>
            </div>
        </div>
    );
}
