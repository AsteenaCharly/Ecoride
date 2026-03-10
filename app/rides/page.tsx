"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRidesStore } from "@/lib/store/rides";
import { RideCard } from "@/components/rides/RideCard";
import { Button } from "@/components/ui/button";
import { RideSearchForm } from "@/components/rides/RideSearchForm";
import { Settings2 } from "lucide-react";

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const searchRides = useRidesStore(state => state.searchRides);
    const addRide = useRidesStore(state => state.addRide);

    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const date = searchParams.get("date") || "";
    const seats = parseInt(searchParams.get("seats") || "1", 10);

    const [showFilters, setShowFilters] = useState(false);
    const [alertCreated, setAlertCreated] = useState(false);
    const [rideRequested, setRideRequested] = useState(false);

    const rides = useMemo(() => {
        return searchRides({ from, to, date, seats });
    }, [from, to, date, seats, searchRides]);

    // If no params, show all scheduled rides
    const allRidesRaw = useRidesStore(state => state.rides);
    const allRides = useMemo(() => allRidesRaw.filter(r => r.status === 'scheduled'), [allRidesRaw]);

    const displayRides = (from || to || date) ? rides : allRides;

    return (
        <div className="bg-surface-bg min-h-screen">
            <div className="bg-surface-container py-8 border-b border-surface-outline/10">
                <div className="container mx-auto px-4 max-w-5xl">
                    <RideSearchForm />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-5xl flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
                    <div className="sticky top-24 bg-surface-container/50 rounded-3xl p-6 border border-surface-outline/10">
                        <h3 className="font-semibold text-lg mb-6">Filters</h3>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-text-secondary mb-3">Sort by</h4>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="sort" className="accent-brand-primary" defaultChecked />
                                        <span className="text-sm">Earliest departure</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="sort" className="accent-brand-primary" />
                                        <span className="text-sm">Lowest price</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-surface-outline/10">
                                <h4 className="text-sm font-medium text-text-secondary mb-3">Preferences</h4>
                                <div className="flex flex-col gap-2">
                        
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="accent-brand-primary rounded" />
                                        <span className="text-sm">Pets allowed</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="accent-brand-primary rounded" />
                                        <span className="text-sm">Female sharing</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full mt-6" variant="outline" onClick={() => setShowFilters(false)}>
                            Apply Filters
                        </Button>
                    </div>
                </div>

                {/* Results List */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-text-primary">
                            {from && to ? `${from} to ${to}` : 'All available rides'}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-text-secondary text-sm hidden sm:inline-block">
                                {displayRides.length} ride{displayRides.length !== 1 ? 's' : ''} found
                            </span>
                            <Button
                                variant="tonal"
                                size="sm"
                                className="hidden sm:flex"
                                onClick={() => {
                                    alert("Demo: Your ride request has been published! Drivers matching this route will be notified.");
                                }}
                            >
                                Request a Ride
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="md:hidden flex items-center gap-2"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Settings2 className="w-4 h-4" /> Filters
                            </Button>
                        </div>
                    </div>

                    {displayRides.length > 0 ? (
                        <div className="space-y-4">
                            {displayRides.map(ride => (
                                <RideCard key={ride.id} ride={ride} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-surface-container rounded-3xl border border-surface-outline/10">
                            <h3 className="text-xl font-bold mb-2">No rides found</h3>
                            <p className="text-text-secondary mb-6 max-w-sm mx-auto">
                                We couldn't find any rides matching your criteria. Try adjusting your filters or date.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Button
                                    variant={alertCreated ? "outline" : "default"}
                                    onClick={() => {
                                        setAlertCreated(true);
                                        alert("Demo: Ride alert created! We'll notify you when a ride matches your criteria.");
                                    }}
                                >
                                    {alertCreated ? "Alert Created ✓" : "Create a ride alert"}
                                </Button>
                                <Button
                                    variant={rideRequested ? "default" : "outline"}
                                    onClick={() => {
                                        setRideRequested(true);
                                        alert("Demo: Your ride request has been published! Drivers matching this route will be notified.");
                                    }}
                                >
                                    {rideRequested ? "Ride Requested ✓" : "Request a Ride"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
