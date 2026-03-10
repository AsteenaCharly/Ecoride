"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRidesStore } from "@/lib/store/rides";
import { useAuthStore } from "@/lib/store/auth";
import { Button } from "@/components/ui/button";
import { AutocompleteInput } from "@/components/ui/autocomplete";
import { ArrowLeft, MapPin, Calendar, Clock, Car, Info } from "lucide-react";

export default function PublishRideWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const { user } = useAuthStore();
    const addRide = useRidesStore(state => state.addRide);

    // Form State
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [seats, setSeats] = useState(3);
    const [vehicle, setVehicle] = useState("Maruti Suzuki Swift");
    const [price, setPrice] = useState(450);
    const [chat, setChat] = useState("Some chat");
    const [isPublishing, setIsPublishing] = useState(false);

    // The global AuthGuard handles redirection if user is null.
    if (!user) return null;

    const nextStep = () => setStep(prev => Math.min(prev + 1, 6));
    const prevStep = () => setStep(prev => prev > 1 ? prev - 1 : prev);

    const handlePublish = () => {
        setIsPublishing(true);

        // Simulate API delay
        setTimeout(() => {
            const newRideId = `r_${Date.now()}`;
            addRide({
                id: newRideId,
                driverId: user?.id || "u2",
                origin: { name: origin, time },
                destination: { name: destination, time: "TBD" }, // Mocked arrival time
                stops: [],
                departureDate: date,
                totalSeats: seats + 1, // driver + pax
                availableSeats: seats,
                pricePerSeat: price,
                status: "scheduled",
                vehicle: { make: vehicle.split(' ')[0], model: vehicle.split(' ')[1] || '', color: "Silver" },
                preferences: { smoking: false, pets: false, luggage: "Small", chat: chat as any }
            });

            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className="bg-surface-bg min-h-screen">
            <div className="bg-surface-container sticky top-16 z-30">
                <div className="h-1 bg-surface-outline/10 w-full overflow-hidden">
                    <div
                        className="h-full bg-brand-primary transition-all duration-300 ease-out"
                        style={{ width: `${(step / 6) * 100}%` }}
                    />
                </div>
                <div className="container mx-auto px-4 max-w-2xl h-16 flex items-center">
                    <button
                        onClick={step === 1 ? () => router.back() : prevStep}
                        className="flex items-center gap-2 text-text-primary hover:text-brand-primary font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16 max-w-2xl">
                <div className="relative overflow-hidden min-h-[400px]">

                    {/* Step 1: Route */}
                    {step === 1 && (
                        <div className="animate-in slide-in-from-right-8 fade-in duration-300 space-y-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Where are you driving?</h1>

                            <div className="space-y-4 relative p-4 bg-surface-container rounded-3xl">
                                <div className="absolute left-[38px] top-12 bottom-12 w-0.5 bg-surface-outline/20" />

                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-4 h-4 rounded-full border-2 border-text-primary bg-surface-bg z-10 shrink-0" />
                                    <AutocompleteInput
                                        placeholder="Leaving from (e.g. Mumbai)"
                                        className="w-full h-14 z-20 bg-surface-bg border border-surface-outline/20 rounded-xl px-4 text-text-primary font-medium focus:border-brand-primary outline-none"
                                        value={origin}
                                        onChangeValue={setOrigin}
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-4 relative ">
                                    <div className="w-4 h-4 rounded-full border-2 border-brand-primary bg-surface-bg  shrink-0" />
                                    <AutocompleteInput
                                        placeholder="Going to (e.g. Pune)"
                                        className="w-full h-14 bg-surface-bg border border-surface-outline/20 rounded-xl px-4 text-text-primary font-medium focus:border-brand-primary outline-none"
                                        value={destination}
                                        onChangeValue={setDestination}
                                        required
                                    />
                                </div>
                            </div>

                            <Button size="lg" className="w-full text-lg h-14 mt-8" onClick={nextStep} disabled={!origin || !destination}>
                                Continue
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Date & Time */}
                    {step === 2 && (
                        <div className="animate-in slide-in-from-right-8 fade-in duration-300 space-y-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">When are you leaving?</h1>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary w-5 h-5" />
                                    <input
                                        type="date"
                                        className="w-full h-14 bg-surface-container border border-surface-outline/20 rounded-xl pl-12 pr-4 text-text-primary font-medium focus:border-brand-primary outline-none"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]} // prevent past dates
                                    />
                                </div>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary w-5 h-5" />
                                    <input
                                        type="time"
                                        className="w-full h-14 bg-surface-container border border-surface-outline/20 rounded-xl pl-12 pr-4 text-text-primary font-medium focus:border-brand-primary outline-none"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button size="lg" className="w-full text-lg h-14 mt-8" onClick={nextStep} disabled={!date || !time}>
                                Continue
                            </Button>
                        </div>
                    )}

                    {/* Step 3: Seats & Vehicle */}
                    {step === 3 && (
                        <div className="animate-in slide-in-from-right-8 fade-in duration-300 space-y-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Ride details</h1>

                            <div>
                                <h3 className="font-semibold text-text-primary mb-4 text-lg">Empty seats available</h3>
                                <div className="flex items-center gap-4">
                                    {[1, 2, 3, 4].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setSeats(num)}
                                            className={`w-14 h-14 rounded-full font-bold text-xl transition-all ${seats === num ? 'bg-brand-primary text-white shadow-md' : 'bg-surface-container text-text-primary hover:bg-surface-low border border-surface-outline/20'}`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-text-primary mb-4 text-lg mt-8">Your vehicle</h3>
                                <div className="relative">
                                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                                    <input
                                        type="text"
                                        className="w-full h-14 bg-surface-container border border-surface-outline/20 rounded-xl pl-12 pr-4 text-text-primary font-medium focus:border-brand-primary outline-none"
                                        value={vehicle}
                                        onChange={(e) => setVehicle(e.target.value)}
                                        placeholder="E.g. Honda City"
                                    />
                                </div>
                            </div>

                            <Button size="lg" className="w-full text-lg h-14 mt-8" onClick={nextStep}>
                                Continue
                            </Button>
                        </div>
                    )}

                    {/* Step 4: Price */}
                    {step === 4 && (
                        <div className="animate-in slide-in-from-right-8 fade-in duration-300 space-y-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Set your price per seat</h1>

                            <div className="bg-surface-container rounded-3xl p-8 border border-surface-outline/10 text-center">
                                <div className="flex items-center justify-center gap-4 mb-8">
                                    <button
                                        onClick={() => setPrice(p => Math.max(50, p - 50))}
                                        className="w-12 h-12 rounded-full bg-surface-bg border border-surface-outline/20 text-2xl flex items-center justify-center hover:bg-surface-low"
                                    >
                                        -
                                    </button>
                                    <span className="text-5xl font-bold text-brand-primary">₹{price}</span>
                                    <button
                                        onClick={() => setPrice(p => p + 50)}
                                        className="w-12 h-12 rounded-full bg-surface-bg border border-surface-outline/20 text-2xl flex items-center justify-center hover:bg-surface-low"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="bg-surface-bg rounded-xl p-4 flex gap-3 text-left">
                                    <Info className="w-5 h-5 text-brand-primary shrink-0" />
                                    <p className="text-sm text-text-secondary">
                                        We recommend ₹450 based on the route distance (150km). This helps passengers save money while covering your fuel costs.
                                    </p>
                                </div>
                            </div>

                            <Button size="lg" className="w-full text-lg h-14 mt-8" onClick={nextStep}>
                                Continue
                            </Button>
                        </div>
                    )}


                    {/* Step 6: Review */}
                    {step === 5 && (
                        <div className="animate-in slide-in-from-right-8 fade-in duration-300 space-y-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Confirm ride details</h1>

                            <div className="bg-surface-bg rounded-3xl shadow-lg border border-surface-outline/10 overflow-hidden">
                                <div className="bg-brand-primary p-6 text-white">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-brand-primary10 text-xl font-medium">{date}</span>
                                        <span className="text-2xl font-bold">₹{price} / seat</span>
                                    </div>
                                    <div className="opacity-90">{seats} seats available</div>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="flex items-stretch gap-4 relative">
                                        <div className="flex flex-col items-center justify-between py-1 w-4 relative z-10">
                                            <div className="w-3 h-3 rounded-full border-2 border-text-primary bg-surface-bg z-10" />
                                            <div className="w-0.5 h-full bg-surface-outline/20 absolute top-3 bottom-0 -z-10" />
                                            <div className="w-3 h-3 rounded-full border-2 border-brand-primary bg-surface-bg z-10 mt-8" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="text-lg font-bold w-12">{time}</span>
                                                <span className="font-medium">{origin}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-6">
                                                <span className="text-lg font-bold w-12 text-text-secondary">TBD</span>
                                                <span className="font-medium">{destination}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-surface-outline/10 pt-4 flex gap-2">
                                        <span className="bg-surface-low px-3 py-1 rounded-lg text-sm font-medium">{vehicle}</span>
                                        <span className="bg-surface-low px-3 py-1 rounded-lg text-sm font-medium">{chat}</span>
                                    </div>
                                </div>
                            </div>

                            <Button size="lg" className="w-full text-lg h-14 mt-8 bg-brand-primary hover:bg-brand-primary90 transition-all font-bold" onClick={handlePublish} disabled={isPublishing}>
                                {isPublishing ? "Publishing..." : "Publish Ride"}
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
