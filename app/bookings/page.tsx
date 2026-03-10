"use client";

import { useState } from "react";
import Link from "next/link";
import { useBookingsStore } from "@/lib/store/bookings";
import { useRidesStore } from "@/lib/store/rides";
import { useAuthStore } from "@/lib/store/auth";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { MapPin, Navigation, Clock, User, MessageCircle, Phone } from "lucide-react";
import { MOCK_USERS } from "@/lib/mock-data/users";

export default function BookingsPage() {
    const { user } = useAuthStore();
    const allBookings = useBookingsStore(state => state.bookings);
    const bookings = allBookings.filter(b => b.passengerId === (user?.id || "u1"));
    const getRideById = useRidesStore(state => state.getRideById);
    const cancelBooking = useBookingsStore(state => state.cancelBooking);

    const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");

    // In a real app we'd compare dates, for mock we just sort by status and treat all 'confirmed' as upcoming
    const upcomingBookings = bookings.filter(b => b.status === "confirmed");
    const pastBookings = bookings.filter(b => b.status === "completed");
    const cancelledBookings = bookings.filter(b => b.status === "cancelled");

    const displayBookings =
        activeTab === "upcoming" ? upcomingBookings :
            activeTab === "past" ? pastBookings :
                cancelledBookings;

    return (
        <div className="bg-surface-bg min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold text-text-primary mb-8">Your rides</h1>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-surface-outline/10 mb-8">
                    {(["upcoming", "past", "cancelled"] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === tab ? "text-brand-primary" : "text-text-secondary hover:text-text-primary"
                                }`}
                        >
                            <span className="capitalize">{tab}</span>
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="space-y-6">
                    {displayBookings.length === 0 ? (
                        <div className="text-center py-20 bg-surface-container rounded-3xl border border-surface-outline/10">
                            <h3 className="text-xl font-bold mb-2">No {activeTab} bookings</h3>
                            <p className="text-text-secondary mb-6">When you book a ride, it will appear here.</p>
                            <Button asChild>
                                <Link href="/rides">Search for a ride</Link>
                            </Button>
                        </div>
                    ) : (
                        displayBookings.map(booking => {
                            const ride = getRideById(booking.rideId);
                            if (!ride) return null;

                            const driver = MOCK_USERS.find(u => u.id === ride.driverId)!;

                            return (
                                <Card key={booking.id} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">

                                            {/* Ride Details Side */}
                                            <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-surface-outline/10">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <h3 className="font-bold text-lg">{ride.departureDate}</h3>
                                                        <p className="text-sm text-text-secondary mt-1">Booking Ref: {booking.id}</p>
                                                    </div>
                                                    <Badge
                                                        variant={booking.status === 'confirmed' ? 'filled' : booking.status === 'cancelled' ? 'secondary' : 'outline'}
                                                        className={booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                                                    >
                                                        {booking.status.toUpperCase()}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-stretch gap-4 relative mb-6">
                                                    <div className="flex flex-col items-center justify-between py-1 w-4 relative z-10">
                                                        <div className="w-3 h-3 rounded-full border-2 border-text-primary bg-surface-bg z-10" />
                                                        <div className="w-0.5 h-full bg-surface-outline/20 absolute top-3 bottom-0 -z-10" />
                                                        <div className="w-3 h-3 rounded-full border-2 border-brand-primary bg-surface-bg z-10 mt-8" />
                                                    </div>

                                                    <div className="flex-1 flex flex-col justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-lg font-bold w-12">{ride.origin.time}</span>
                                                            <span className="font-medium">{ride.origin.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-4">
                                                            <span className="text-lg font-bold w-12">{ride.destination.time}</span>
                                                            <span className="font-medium">{ride.destination.name}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 pt-6 border-t border-surface-outline/10">
                                                    <Avatar src={driver.avatarUrl} alt={driver.name} verified={driver.isVerified} size="md" className="shrink-0" />
                                                    <div>
                                                        <div className="font-medium text-sm text-text-primary">Driver: {driver.name}</div>
                                                        <div className="text-xs text-text-secondary flex items-center gap-1">★ {driver.rating}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Side */}
                                            <div className="w-full md:w-64 p-6 md:p-8 bg-surface-container flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-text-secondary">{booking.seatsBooked} seats</span>
                                                        <span className="font-medium">{formatCurrency(booking.totalAmount)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm mb-4">
                                                        <span className="text-text-secondary">Amount paid</span>
                                                        <span className="font-medium text-brand-primary">{formatCurrency(booking.totalAmount)}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-3 mt-4">
                                                    {booking.status === 'confirmed' && (
                                                        <>
                                                            <div className="flex gap-2">
                                                                <Button variant="default" className="flex-1 flex justify-center gap-2" asChild>
                                                                    <Link className="flex gap-2" href={`/chat/${ride.driverId}`}>
                                                                        <MessageCircle className="w-4 h-4" /> Message
                                                                    </Link>
                                                                </Button>
                                                                <Button variant="outline" className="px-3" onClick={() => alert("Calling driver: +91 98765 43210")}>
                                                                    <Phone className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full"
                                                                onClick={() => {
                                                                    if (confirm("Are you sure you want to cancel this booking?")) {
                                                                        cancelBooking(booking.id);
                                                                        alert("Booking cancelled successfully. Your refund will be processed within 4 business days.");
                                                                    }
                                                                }}
                                                            >
                                                                Cancel booking
                                                            </Button>
                                                        </>
                                                    )}

                                                    {booking.status === 'completed' && (
                                                        <Button variant="default" className="w-full flex justify-center gap-2">
                                                            ★ Rate this trip
                                                        </Button>
                                                    )}

                                                    {booking.status === 'cancelled' && (
                                                        <Button variant="outline" className="w-full flex justify-center gap-2" asChild>
                                                            <Link href="/rides">Book another ride</Link>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

            </div>
        </div>
    );
}
