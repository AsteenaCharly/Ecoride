"use client";

import Link from "next/link";
import { Ride } from "@/types";
import { MOCK_USERS } from "@/lib/mock-data/users";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { User, ShieldCheck, CigaretteOff, Dog, MessageCircle } from "lucide-react";
import { formatCurrency, formatDuration } from "@/lib/utils";

export function RideCard({ ride }: { ride: Ride }) {
    const driver = MOCK_USERS.find(u => u.id === ride.driverId) || MOCK_USERS[0];

    return (
        <Link href={`/rides/${ride.id}`} className="block">
            <div className="bg-surface-bg rounded-3xl border border-surface-outline/10 p-5 hover:shadow-md hover:scale-[1.01] transition-all duration-300 relative group overflow-hidden">

                {/* Decorative active edge */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <Avatar src={driver.avatarUrl} verified={driver.isVerified} />
                        <div>
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-text-primary text-base">{driver.name}</span>
                                {driver.isVerified && <ShieldCheck className="w-4 h-4 text-brand-primary" />}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-text-secondary mt-0.5">
                                <span className="flex items-center gap-0.5 text-yellow-600 font-medium">
                                    ★ {driver.rating}
                                </span>
                                <span>• {driver.totalTrips} trips</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-brand-primary">₹{ride.pricePerSeat}</span>
                    </div>
                </div>

                <div className="flex items-stretch gap-4 relative">
                    <div className="flex flex-col items-center justify-between py-2 w-4 relative z-10">
                        <div className="w-3 h-3 rounded-full border-2 border-text-primary bg-surface-bg z-10" />
                        <div className="w-0.5 h-full bg-surface-outline/20 absolute top-3 bottom-0 -z-10" />
                        <div className="w-3 h-3 rounded-full border-2 border-brand-primary bg-surface-bg z-10 mt-10" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between pt-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-lg font-bold text-text-primary block leading-none">{ride.origin.time}</span>
                                <span className="text-text-primary font-medium">{ride.origin.name}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                            <div>
                                <span className="text-lg font-bold text-text-primary block leading-none">{ride.destination.time}</span>
                                <span className="text-text-primary font-medium">{ride.destination.name}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-5 border-t border-surface-outline/10 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-text-secondary">
                        {!ride.preferences.smoking && <CigaretteOff className="w-4 h-4" />}
                        {ride.preferences.pets && <Dog className="w-4 h-4" />}
                        {ride.preferences.chat !== "Silent" && <MessageCircle className="w-4 h-4" />}
                        <span className="text-sm font-medium ml-2">{ride.vehicle.make} {ride.vehicle.model}</span>
                    </div>

                    <Badge variant={ride.availableSeats > 0 ? "filled" : "secondary"}>
                        {ride.availableSeats} seat{ride.availableSeats !== 1 ? 's' : ''} left
                    </Badge>
                </div>
            </div>
        </Link>
    );
}
