"use client";

import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useRidesStore } from "@/lib/store/rides";
import { useAuthStore } from "@/lib/store/auth";
import { useBookingsStore } from "@/lib/store/bookings";
import { Button } from "@/components/ui/button";
import { Copy, ArrowRight, ShieldCheck, CheckCircle, Clock } from "lucide-react";

export default function BookingFlowPage() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const seats = parseInt(searchParams.get("seats") || "1", 10);
    const ride = useRidesStore(state => state.getRideById(id as string));
    const { user } = useAuthStore();
    const addBooking = useBookingsStore(state => state.addBooking);

    const [step, setStep] = useState<"details" | "payment" | "processing" | "success">("details");

    if (!ride) return <div className="p-20 text-center">Ride not found</div>;
    // The global AuthGuard handles redirection if user is null.
    if (!user) return null;

    const amount = (ride.pricePerSeat * seats) + 15; // +15 fee

    const handleProceedToPayment = () => setStep("payment");

    const handlePay = () => {
        setStep("processing");
        // Simulate 3 second payment process
        setTimeout(() => {
            const bookingId = `BLB-${Math.floor(Math.random() * 900000) + 100000}`;
            addBooking({
                id: bookingId,
                rideId: ride.id,
                passengerId: user?.id || "u1",
                seatsBooked: seats,
                totalAmount: amount,
                status: "confirmed",
                createdAt: new Date().toISOString()
            });
            setStep("success");
        }, 3000);
    };

    return (
        <div className="bg-surface-bg min-h-screen pt-16 pb-24">
            <div className="max-w-xl mx-auto px-4">

                {step === "details" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="text-3xl font-bold text-text-primary mb-8">Confirm your details</h1>

                        <div className="bg-surface-container rounded-3xl p-6 border border-surface-outline/10 mb-8">
                            <h3 className="font-semibold text-text-secondary mb-4">Passenger info</h3>
                            <div className="space-y-4">
                                <input type="text" value={user?.name || "Rahul Sharma"} className="w-full h-14 rounded-xl px-4 bg-surface-bg border border-surface-outline/20 font-medium text-text-primary outline-none focus:border-brand-primary" readOnly />
                                <input type="text" value={user?.phone || "+91 9876543210"} className="w-full h-14 rounded-xl px-4 bg-surface-bg border border-surface-outline/20 font-medium text-text-primary outline-none focus:border-brand-primary" readOnly />
                            </div>
                            <p className="text-xs text-text-secondary mt-3 mt-4">Demo: Information is pre-filled from your profile.</p>
                        </div>

                        <Button size="lg" className="w-full text-lg h-14" onClick={handleProceedToPayment}>
                            Continue to payment
                        </Button>
                    </div>
                )}

                {step === "payment" && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="bg-[#121212] rounded-[32px] p-6 md:p-8 text-white shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-brand-primary to-emerald-600" />
                            <div className="text-center mb-6 md:mb-8">
                                <h2 className="text-sm md:text-lg text-gray-400 font-medium mb-1">Pay Securely to</h2>
                                <div className="text-xl md:text-2xl font-bold tracking-tight">EcoRide App</div>
                                <div className="text-4xl md:text-5xl font-bold mt-2 md:mt-4">₹{amount}</div>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-4 md:p-6 mb-6 flex flex-col items-center border border-white/10">
                                {/* Fake QR using basic CSS boxes for a mock look instantly without rendering actual canvas */}
                                <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-xl p-2 md:p-3 flex flex-wrap gap-1">
                                    {Array.from({ length: 100 }).map((_, i) => (
                                        <div key={i} className={`w-[10px] h-[10px] md:w-[14px] md:h-[14px] ${Math.random() > 0.4 ? 'bg-black' : 'bg-transparent'}`} />
                                    ))}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 md:p-2 rounded-lg">
                                        <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-brand-primary rounded flex items-center justify-center font-bold text-brand-primary text-[10px] md:text-xs tracking-tighter">UPI</div>
                                    </div>
                                </div>
                                <div className="mt-4 text-emerald-400 font-medium text-xs md:text-sm flex items-center gap-2">
                                    <Clock className="w-3 h-3 md:w-4 md:h-4" /> QR expires in 09:47
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                <div className="relative flex justify-center"><span className="bg-[#121212] px-4 text-xs md:text-sm text-gray-400">or pay with UPI ID</span></div>
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row gap-2">
                                <input type="text" placeholder="name@upi" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 sm:py-0 text-white outline-none focus:border-brand-primary text-sm" defaultValue="rahul@oksbi" />
                                <Button className="bg-brand-primary hover:bg-brand-primary90 text-white h-12 sm:h-auto" onClick={handlePay}>Verify & Pay</Button>
                            </div>
                        </div>
                    </div>
                )}

                {step === "processing" && (
                    <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in duration-300">
                        <div className="w-20 h-20 mb-8 relative">
                            <div className="absolute inset-0 border-4 border-surface-outline/20 rounded-full" />
                            <div className="absolute inset-0 border-4 border-brand-primary rounded-full border-t-transparent animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary mb-2">Processing payment</h2>
                        <p className="text-text-secondary animate-pulse text-lg">Confirming with the bank...</p>
                    </div>
                )}

                {step === "success" && (
                    <div className="flex flex-col items-center justify-center h-[60vh] animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-brand-primary rounded-full flex items-center justify-center mb-8 drop-shadow-xl animate-in fade-in slide-in-from-bottom-4">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-text-primary mb-4">Booking Confirmed!</h2>
                        <p className="text-lg text-text-secondary text-center mb-10 max-w-sm">
                            Your seats are secured. We've notified the driver.
                        </p>
                        <div className="flex flex-col w-full gap-4">
                            <Button size="lg" className="w-full text-lg h-14" onClick={() => router.push('/bookings')}>
                                View My Bookings
                            </Button>
                            <Button size="lg" variant="tonal" className="w-full text-lg h-14" onClick={() => router.push('/')}>
                                Back to Home
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
