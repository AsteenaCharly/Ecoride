import { create } from 'zustand';
import { Ride, RideFilters } from '@/types';
import { MOCK_RIDES } from '../mock-data/rides';

interface RidesState {
    rides: Ride[];
    addRide: (ride: Ride) => void;
    updateRide: (id: string, updates: Partial<Ride>) => void;
    cancelRide: (id: string) => void;
    getRideById: (id: string) => Ride | undefined;
    searchRides: (filters: RideFilters) => Ride[];
}

export const useRidesStore = create<RidesState>((set, get) => ({
    rides: MOCK_RIDES,

    addRide: (ride: Ride) => {
        set((state) => ({ rides: [...state.rides, ride] }));
    },

    updateRide: (id: string, updates: Partial<Ride>) => {
        set((state) => ({
            rides: state.rides.map(r => r.id === id ? { ...r, ...updates } : r)
        }));
    },

    cancelRide: (id: string) => {
        set((state) => ({
            rides: state.rides.map(r =>
                r.id === id ? { ...r, status: 'cancelled' } : r
            )
        }));
    },

    getRideById: (id: string) => {
        return get().rides.find(r => r.id === id);
    },

    searchRides: (filters: RideFilters) => {
        let results = get().rides.filter(r => r.status === 'scheduled');

        if (filters.from) {
            results = results.filter(r =>
                r.origin.name.toLowerCase().includes(filters.from!.toLowerCase()) ||
                r.stops.some(s => s.name.toLowerCase().includes(filters.from!.toLowerCase()))
            );
        }

        if (filters.to) {
            results = results.filter(r =>
                r.destination.name.toLowerCase().includes(filters.to!.toLowerCase()) ||
                r.stops.some(s => s.name.toLowerCase().includes(filters.to!.toLowerCase()))
            );
        }

        if (filters.date) {
            results = results.filter(r => r.departureDate >= filters.date!);
        }

        if (filters.seats) {
            results = results.filter(r => r.availableSeats >= filters.seats!);
        }

        // Sort logic can be added here or in the component depending on the UI

        return results;
    }
}));
