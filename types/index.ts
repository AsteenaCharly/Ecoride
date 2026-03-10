export type User = {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatarUrl: string;
    rating: number;
    totalTrips: number;
    memberSince: string;
    isVerified: boolean;
    bio?: string;
    preferences: {
        smoking: boolean;
        pets: boolean;
        music: "No" | "Yes" | "Depends";
        chat: "Silent" | "Some chat" | "Chatty";
    };
};

export type RideStatus = "scheduled" | "active" | "completed" | "cancelled";

export type CityStop = {
    name: string;
    time: string; // ISO or HH:mm
    coordinates?: [number, number];
};

export type Ride = {
    id: string;
    driverId: string;
    origin: CityStop;
    destination: CityStop;
    stops: CityStop[];
    departureDate: string; // YYYY-MM-DD
    totalSeats: number;
    availableSeats: number;
    pricePerSeat: number;
    status: RideStatus;
    vehicle: {
        make: string;
        model: string;
        color: string;
        photoUrl?: string; // Optional
    };
    preferences: {
        smoking: boolean;
        pets: boolean;
        luggage: "Small" | "Backpack" | "Large";
        chat: "Silent" | "Some chat" | "Chatty";
    };
};

export type RideFilters = {
    from?: string;
    to?: string;
    date?: string;
    seats?: number;
};

export type BookingStatus = "confirmed" | "completed" | "cancelled";

export type Booking = {
    id: string;
    rideId: string;
    passengerId: string;
    seatsBooked: number;
    totalAmount: number;
    status: BookingStatus;
    createdAt: string;
};

export type Review = {
    id: string;
    rideId: string;
    reviewerId: string;
    revieweeId: string;
    rating: number;
    comment?: string;
    tags: string[]; // e.g., 'Punctual', 'Clean car'
    createdAt: string;
};

export type Message = {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    createdAt: string;
    isSystem?: boolean;
};

export type Conversation = {
    id: string;
    rideId?: string;
    participants: string[]; // [userId1, userId2]
    lastMessage?: string;
    lastMessageAt?: string;
    unreadCount?: Record<string, number>; // { userId: count }
};
