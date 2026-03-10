import { Ride } from "@/types";

const today = new Date();
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export const MOCK_RIDES: Ride[] = [
    {
        id: "r1",
        driverId: "u2",
        origin: { name: "Mumbai", time: "06:00", coordinates: [72.8777, 19.0760] },
        destination: { name: "Pune", time: "09:30", coordinates: [73.8567, 18.5204] },
        stops: [{ name: "Lonavala", time: "07:45" }],
        departureDate: formatDate(tomorrow()),
        totalSeats: 4,
        availableSeats: 2,
        pricePerSeat: 450,
        status: "scheduled",
        vehicle: { make: "Hyundai", model: "i20", color: "White" },
        preferences: { smoking: false, pets: false, luggage: "Small", chat: "Some chat" },
    },
    {
        id: "r2",
        driverId: "u3",
        origin: { name: "Delhi", time: "18:00", coordinates: [77.2090, 28.6139] },
        destination: { name: "Agra", time: "21:30", coordinates: [78.0081, 27.1767] },
        stops: [],
        departureDate: formatDate(today),
        totalSeats: 3,
        availableSeats: 3,
        pricePerSeat: 500,
        status: "scheduled",
        vehicle: { make: "Honda", model: "City", color: "Silver" },
        preferences: { smoking: true, pets: false, luggage: "Backpack", chat: "Silent" },
    },
    {
        id: "r3",
        driverId: "u4",
        origin: { name: "Bangalore", time: "05:30", coordinates: [77.5946, 12.9716] },
        destination: { name: "Mysore", time: "08:45", coordinates: [76.6394, 12.2958] },
        stops: [{ name: "Mandya", time: "07:30" }],
        departureDate: formatDate(tomorrow()),
        totalSeats: 4,
        availableSeats: 1,
        pricePerSeat: 300,
        status: "scheduled",
        vehicle: { make: "Maruti Suzuki", model: "SwiftDzire", color: "Grey" },
        preferences: { smoking: false, pets: true, luggage: "Small", chat: "Some chat" },
    },
    {
        id: "r4",
        driverId: "u5",
        origin: { name: "Chennai", time: "07:00", coordinates: [80.2707, 13.0827] },
        destination: { name: "Pondicherry", time: "10:30", coordinates: [79.8083, 11.9416] },
        stops: [],
        departureDate: formatDate(nextWeek),
        totalSeats: 4,
        availableSeats: 4,
        pricePerSeat: 600,
        status: "scheduled",
        vehicle: { make: "Toyota", model: "Innova", color: "Black" },
        preferences: { smoking: false, pets: false, luggage: "Large", chat: "Chatty" },
    },
    {
        id: "r5",
        driverId: "u2",
        origin: { name: "Pune", time: "17:00", coordinates: [73.8567, 18.5204] },
        destination: { name: "Mumbai", time: "20:30", coordinates: [72.8777, 19.0760] },
        stops: [{ name: "Lonavala", time: "18:45" }],
        departureDate: formatDate(nextWeek),
        totalSeats: 4,
        availableSeats: 2,
        pricePerSeat: 450,
        status: "scheduled",
        vehicle: { make: "Hyundai", model: "i20", color: "White" },
        preferences: { smoking: false, pets: false, luggage: "Small", chat: "Some chat" },
    }
];

function tomorrow() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
}
