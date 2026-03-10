import { create } from 'zustand';
import { Booking } from '@/types';
import { MOCK_BOOKINGS } from '../mock-data/bookings';

interface BookingsState {
    bookings: Booking[];
    addBooking: (booking: Booking) => void;
    updateBooking: (id: string, updates: Partial<Booking>) => void;
    cancelBooking: (id: string) => void;
    getUserBookings: (userId: string) => Booking[];
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
    bookings: MOCK_BOOKINGS,

    addBooking: (booking: Booking) => {
        set((state) => ({ bookings: [...state.bookings, booking] }));
    },

    updateBooking: (id: string, updates: Partial<Booking>) => {
        set((state) => ({
            bookings: state.bookings.map(b => b.id === id ? { ...b, ...updates } : b)
        }));
    },

    cancelBooking: (id: string) => {
        set((state) => ({
            bookings: state.bookings.map(b =>
                b.id === id ? { ...b, status: 'cancelled' } : b
            )
        }));
    },

    getUserBookings: (userId: string) => {
        return get().bookings.filter(b => b.passengerId === userId);
    }
}));
