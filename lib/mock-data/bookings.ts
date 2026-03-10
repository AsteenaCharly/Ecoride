import { Booking } from "@/types";

export const MOCK_BOOKINGS: Booking[] = [
    {
        id: "BLB-839210",
        rideId: "r1",
        passengerId: "u1",
        seatsBooked: 1,
        totalAmount: 465, // 450 + 15 convenience fee
        status: "confirmed",
        createdAt: "2023-10-24T10:30:00Z"
    },
    {
        id: "BLB-102934",
        rideId: "r2",
        passengerId: "u1",
        seatsBooked: 2,
        totalAmount: 1015,
        status: "completed",
        createdAt: "2023-09-15T14:20:00Z"
    },
    {
        id: "BLB-554422",
        rideId: "r4",
        passengerId: "u1",
        seatsBooked: 1,
        totalAmount: 615,
        status: "cancelled",
        createdAt: "2023-08-05T09:10:00Z"
    }
];
