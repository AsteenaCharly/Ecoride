"use client";

import { useRidesStore } from "@/lib/store/rides";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { MOCK_USERS } from "@/lib/mock-data/users";
import { MOCK_REVIEWS } from "@/lib/mock-data/reviews";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SeatPicker } from "@/components/rides/SeatPicker";
import { ArrowLeft, Clock, ShieldCheck, MapPin, CigaretteOff, MessageCircle, Dog, AlertCircle, Info } from "lucide-react";

export default function RideDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const ride = useRidesStore(state => state.getRideById(id as string));

    const [selectedSeats, setSelectedSeats] = useState(1);
    const CONVENIENCE_FEE = 15;

    if (!ride) {
        return <div className="p-20 text-center">Ride not found</div>;
    }

    const driver = MOCK_USERS.find(u => u.id === ride.driverId)!;
    const reviews = MOCK_REVIEWS.filter(r => r.revieweeId === driver.id);

    const handleBookNow = () => {
        // Navigate to booking flow (mock payment)
        router.push(`/rides/${ride.id}/book?seats=${selectedSeats}`);
    };

    return (
        <div className="bg-surface-bg min-h-screen">
            {/* Header Bar */}
            <div className="bg-surface-container border-b border-surface-outline/10 sticky top-16 z-30">
                <div className="container mx-auto px-4 max-w-5xl h-16 flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-text-primary hover:text-brand-primary font-medium">
                        <ArrowLeft className="w-5 h-5" /> Back to search
                    </button>
                    <div className="text-xl font-bold text-text-primary hidden sm:block">
                        {ride.departureDate}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-5xl flex flex-col lg:flex-row gap-8">
                {/* Left Column: Details */}
                <div className="flex-1 space-y-8">

                    {/* Timeline / Route */}
                    <section>
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Trip plan</h2>
                        <div className="bg-surface-container rounded-3xl p-6 md:p-8 border border-surface-outline/10 relative">
                            <div className="absolute left-[45px] top-10 bottom-12 w-1 bg-surface-outline/20 rounded-full" />

                            <div className="flex gap-6 items-start relative z-10 mb-8">
                                <div className="w-16 pt-1 text-right font-bold text-lg text-text-primary">{ride.origin.time}</div>
                                <div className="w-4 h-4 rounded-full border-[3px] border-surface-bg ring-2 ring-text-primary bg-text-primary mt-2" />
                                <div>
                                    <h3 className="font-bold text-lg text-text-primary">{ride.origin.name}</h3>
                                </div>
                            </div>

                            {ride.stops.map((stop, i) => (
                                <div key={i} className="flex gap-6 items-start relative z-10 mb-8">
                                    <div className="w-16 pt-1 text-right font-medium text-text-secondary">{stop.time}</div>
                                    <div className="w-4 h-4 rounded-full border-[3px] border-surface-bg ring-2 ring-brand-primary bg-brand-primary mt-2" />
                                    <div>
                                        <h3 className="font-medium text-text-primary">{stop.name}</h3>
                                    </div>
                                </div>
                            ))}

                            <div className="flex gap-6 items-start relative z-10">
                                <div className="w-16 pt-1 text-right font-bold text-lg text-text-primary">{ride.destination.time}</div>
                                <div className="w-4 h-4 rounded-full border-[3px] border-surface-bg ring-2 ring-text-primary bg-text-primary mt-2" />
                                <div>
                                    <h3 className="font-bold text-lg text-text-primary">{ride.destination.name}</h3>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Map Box */}
                    <section className="h-64 sm:h-80 bg-surface-low rounded-3xl border border-surface-outline/10 overflow-hidden relative">
                        <img
                            src={ride.origin.coordinates && ride.destination.coordinates ?
                                `https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/static/path-5+3b82f6-0.5(${ride.origin.coordinates[0]},${ride.origin.coordinates[1]};${ride.destination.coordinates[0]},${ride.destination.coordinates[1]})/auto/800x400?padding=50&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
                                : "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop"
                            }
                            alt={`Map showing route from ${ride.origin.name} to ${ride.destination.name}`}
                            className="w-full h-full object-cover"

                        />
                        <div className="absolute bottom-4 left-4 bg-surface-bg/90 backdrop-blur px-3 py-1.5 rounded-full font-medium text-xs text-text-primary shadow-sm flex items-center gap-1.5 border border-surface-outline/10">
                            <MapPin className="w-3.5 h-3.5 text-brand-primary" /> Route Map
                        </div>
                    </section>

                    {/* Driver Info */}
                    <section>
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Driver</h2>
                        <Card className="p-0 overflow-hidden group hover:scale-100 cursor-default">
                            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                                <Avatar src={driver.avatarUrl} verified={driver.isVerified} size="xl" className="shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-2xl font-bold text-text-primary">{driver.name}</h3>
                                        {driver.isVerified && <ShieldCheck className="w-6 h-6 text-brand-primary" />}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
                                        <span className="flex items-center gap-1 text-yellow-600 font-medium bg-yellow-50 px-2 py-1 rounded-md">
                                            ★ {driver.rating} ({driver.totalTrips} reviews)
                                        </span>
                                        <span>Member since {driver.memberSince.substring(0, 4)}</span>
                                    </div>
                                    <p className="text-text-primary italic">"{driver.bio}"</p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Vehicle & Rules */}
                    <section className="grid md:grid-cols-2 gap-6">
                        <div className="bg-surface-container rounded-3xl p-6 border border-surface-outline/10">
                            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                                Vehicle
                            </h3>
                            <p className="text-lg font-medium">{ride.vehicle.make} {ride.vehicle.model}</p>
                            <p className="text-text-secondary">{ride.vehicle.color}</p>
                        </div>

                        <div className="bg-surface-container rounded-3xl p-6 border border-surface-outline/10">
                            <h3 className="font-bold text-text-primary mb-4">Preferences</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-text-secondary">
                                    <CigaretteOff className="w-5 h-5 text-brand-primary" />
                                    <span>{ride.preferences.smoking ? "Smoking allowed" : "No smoking please"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-text-secondary">
                                    <MessageCircle className="w-5 h-5 text-brand-primary" />
                                    <span>{ride.preferences.chat}</span>
                                </div>
                                <div className="flex items-center gap-3 text-text-secondary">
                                    <Dog className="w-5 h-5 text-brand-primary" />
                                    <span>{ride.preferences.pets ? "Pets are welcome" : "No pets please"}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Reviews Preview */}
                    <section>
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Reviews for {driver.name.split(' ')[0]}</h2>
                        {reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map(r => (
                                    <div key={r.id} className="border-b border-surface-outline/10 pb-6 last:border-0">
                                        <div className="flex items-center gap-1 text-yellow-500 mb-2">
                                            ★ {r.rating}
                                        </div>
                                        <p className="text-text-primary mb-3">"{r.comment}"</p>
                                        <div className="text-sm text-text-secondary">{r.createdAt.split('T')[0]}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-text-secondary">No reviews for this driver yet.</p>
                        )}
                    </section>

                </div>

                {/* Right Column: Sticky Booking Card */}
                <div className="lg:w-[400px]">
                    <div className="sticky top-40 bg-surface-bg rounded-3xl border border-surface-outline/10 shadow-lg overflow-hidden">
                        <div className="bg-brand-primary p-6 text-white">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-brand-primary10 text-xl font-medium">Total price</span>
                                <span className="text-4xl font-bold">₹{ride.pricePerSeat * selectedSeats + CONVENIENCE_FEE}</span>
                            </div>
                            <div className="text-right text-brand-primary10 text-sm">per person: ₹{ride.pricePerSeat}</div>
                        </div>

                        <div className="p-6 md:p-8 space-y-6">
                            <div className="bg-surface-container rounded-2xl p-4 flex flex-col items-center">
                                <h4 className="font-semibold text-text-primary mb-2">Select seats</h4>
                                <SeatPicker
                                    totalSeats={ride.totalSeats}
                                    availableSeats={ride.availableSeats}
                                    selectedSeats={selectedSeats}
                                    onSelect={setSelectedSeats}
                                />
                                <div className="mt-4 flex gap-4 text-xs font-medium text-text-secondary">
                                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-white border border-surface-outline/20" /> Available</span>
                                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-brand-primary" /> Selected</span>
                                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-surface-outline/20" /> Taken</span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-surface-outline/10">
                                <div className="flex justify-between text-text-secondary">
                                    <span>{selectedSeats} seat{selectedSeats > 1 ? 's' : ''} × ₹{ride.pricePerSeat}</span>
                                    <span>₹{ride.pricePerSeat * selectedSeats}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Booking fee</span>
                                    <span>₹{CONVENIENCE_FEE}</span>
                                </div>
                            </div>

                            <Button size="lg" className="w-full text-lg h-14" onClick={handleBookNow}>
                                Continue
                            </Button>

                            <div className="flex gap-3 text-sm text-text-secondary bg-surface-low p-4 rounded-xl">
                                <Info className="w-5 h-5 shrink-0 text-brand-primary" />
                                <p>The driver's exact phone number will be revealed after booking confirmation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
