"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SeatPickerProps {
    totalSeats: number;
    availableSeats: number;
    selectedSeats: number;
    onSelect: (seats: number) => void;
    className?: string;
}

export function SeatPicker({ totalSeats, availableSeats, selectedSeats, onSelect, className }: SeatPickerProps) {
    // Pre-calculate which seats are taken (total - available)
    // For demo: Driver is top right (steer), Passenger is top left. Back row is 3 seats.
    // If total is 4 (driver + 3 passengers), we only render passenger seats.

    const takenCount = totalSeats - availableSeats;

    // Create an array representing passenger seats (1 to totalSeats)
    // State: 0 = taken, 1 = available, 2 = selected
    // We'll fill 'taken' seats first from the back row
    const seats = Array.from({ length: totalSeats }).map((_, i) => {
        if (i < takenCount) return 0; // taken
        if (i < takenCount + selectedSeats) return 2; // selected
        return 1; // available
    });

    const handleSeatClick = (state: number) => {
        // Only allow clicking available or selected seats
        if (state === 0) return;

        if (state === 1 && selectedSeats < availableSeats) {
            onSelect(selectedSeats + 1);
        } else if (state === 2 && selectedSeats > 1) {
            onSelect(selectedSeats - 1);
        }
    };

    return (
        <div className={cn("relative w-48 h-64 mx-auto", className)}>
            {/* SVG Car Outline */}
            <svg viewBox="0 0 160 220" className="w-full h-full drop-shadow-md">
                <path
                    d="M30 20 C60 5, 100 5, 130 20 L140 60 C145 100, 145 150, 135 190 C120 215, 40 215, 25 190 C15 150, 15 100, 20 60 Z"
                    fill="#F3FAF3"
                    stroke="#79747E"
                    strokeWidth="3"
                />
                {/* Windshield */}
                <path d="M40 45 C70 35, 90 35, 120 45 L115 70 C80 65, 60 65, 45 70 Z" fill="#E8F5E8" stroke="#79747E" strokeWidth="2" opacity="0.6" />
                {/* Rear window */}
                <path d="M45 170 C70 178, 90 178, 115 170 L110 155 C80 160, 60 160, 50 155 Z" fill="#E8F5E8" stroke="#79747E" strokeWidth="2" opacity="0.6" />
                {/* Details: mirrors */}
                <rect x="18" y="75" width="8" height="20" rx="4" fill="#79747E" />
                <rect x="134" y="75" width="8" height="20" rx="4" fill="#79747E" />
            </svg>

            {/* Driver Seat (Always taken, top right for Right Hand Drive in India) */}
            <div
                className="absolute top-[85px] right-[28px] w-12 h-14 rounded-xl bg-surface-outline/30 flex items-center justify-center cursor-not-allowed border-2 border-surface-bg"
                title="Driver"
            >
                <div className="w-6 h-6 rounded-full border-4 border-surface-outline/50 -translate-y-2 translate-x-1" /> {/* Steering wheel indicator */}
            </div>

            {/* Front Passenger Seat (Seat index 0) */}
            {seats.length > 0 && (
                <SeatElement
                    state={seats[0]}
                    onClick={() => handleSeatClick(seats[0])}
                    className="absolute top-[85px] left-[28px]"
                />
            )}

            {/* Back Row (Seats 1, 2, 3) */}
            <div className="absolute top-[145px] left-[20px] right-[20px] flex justify-between px-2">
                {seats.slice(1, 4).map((state, idx) => (
                    <SeatElement
                        key={`back-${idx}`}
                        state={state}
                        onClick={() => handleSeatClick(state)}
                    />
                ))}
            </div>
        </div>
    );
}

function SeatElement({ state, onClick, className }: { state: number; onClick: () => void; className?: string }) {
    // state: 0 = taken, 1 = available, 2 = selected
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={state === 0}
            className={cn(
                "w-10 h-14 rounded-xl flex items-center justify-center transition-all duration-300 border-2 border-surface-bg",
                {
                    "bg-surface-outline/20 cursor-not-allowed shadow-inner": state === 0,
                    "bg-white shadow-md hover:-translate-y-1 hover:shadow-lg cursor-pointer": state === 1,
                    "bg-brand-primary text-white shadow-lg scale-105 transform ring-2 ring-brand-primary ring-offset-2": state === 2,
                },
                className
            )}
        >
            {state === 2 && <Check className="w-5 h-5 text-white animate-in zoom-in" />}
        </button>
    );
}
