"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { AutocompleteInput } from "../ui/autocomplete";

export function RideSearchForm({ className }: { className?: string }) {
    const router = useRouter();
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [seats, setSeats] = useState("1");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (from) params.append("from", from);
        if (to) params.append("to", to);
        if (date) params.append("date", date);
        if (seats) params.append("seats", seats);

        router.push(`/rides?${params.toString()}`);
    };

    return (
        <form
            onSubmit={handleSearch}
            className={`bg-surface-bg rounded-3xl shadow-lg p-2 flex flex-col md:flex-row items-center gap-2 border border-surface-outline/10 ${className || ''}`}
        >
            <div className="flex-1 flex w-full relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary z-10">
                    <div className="w-3 h-3 rounded-full border-2 border-current" />
                </div>
                <AutocompleteInput
                    placeholder="Leaving from..."
                    className="w-full h-14 pl-12 pr-4 bg-transparent outline-none text-text-primary text-base placeholder:text-text-secondary"
                    value={from}
                    onChangeValue={setFrom}
                    required
                />
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-surface-outline/20" />
            </div>

            <div className="w-full h-px md:hidden bg-surface-outline/10" />

            <div className="flex-1 flex w-full relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary z-10">
                    <MapPin className="w-4 h-4" />
                </div>
                <AutocompleteInput
                    placeholder="Going to..."
                    className="w-full h-14 pl-12 pr-4 bg-transparent outline-none text-text-primary text-base placeholder:text-text-secondary"
                    value={to}
                    onChangeValue={setTo}
                    required
                />
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-surface-outline/20" />
            </div>

            <div className="w-full h-px md:hidden bg-surface-outline/10" />

            <div className="flex-1 flex w-full relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                    <Calendar className="w-4 h-4" />
                </div>
                <input
                    type="date"
                    className="w-full h-14 pl-12 pr-4 bg-transparent outline-none text-text-primary text-base placeholder:text-text-secondary [&::-webkit-calendar-picker-indicator]:hidden cursor-pointer"
                    value={date}
                    onClick={(e) => {
                        try {
                            e.currentTarget.showPicker();
                        } catch (err) {
                            // Ignore for unsupported browsers
                        }
                    }}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                />
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-surface-outline/20" />
            </div>

            <div className="w-full h-px md:hidden bg-surface-outline/10" />

            <div className="flex-[0.5] flex w-full relative border-r border-transparent">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                    <Users className="w-4 h-4" />
                </div>
                <select
                    className="w-full h-14 pl-12 pr-8 bg-transparent outline-none text-text-primary text-base appearance-none cursor-pointer"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>

            <Button type="submit" size="lg" className="w-full md:w-auto mt-2 md:mt-0 px-8 py-3.5 h-auto whitespace-nowrap text-lg">
                Search
            </Button>
        </form>
    );
}
