import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { MOCK_USERS } from '../mock-data/users';

interface AuthState {
    user: User | null;
    token: string | null;
    login: (name: string, phone: string, password?: string) => void; // mocks login
    logout: () => void;
    updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null, // Initially logged out
            token: null,

            login: (name: string, phone: string, password?: string) => {
                // Any credentials work for the demo. We'll find a matching mock user or fallback to u1, but update the name.
                const foundUser = MOCK_USERS.find(u => u.phone === phone) || MOCK_USERS[0];
                set({
                    user: { ...foundUser, name, phone }, // Update with provided name and phone
                    token: 'mock-jwt-token-abcd-1234'
                });
            },

            logout: () => {
                set({ user: null, token: null });
            },

            updateProfile: (data: Partial<User>) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...data } : null,
                }));
            }
        }),
        {
            name: 'blablacar-auth-storage',
        }
    )
);
