import { Review } from "@/types";

export const MOCK_REVIEWS: Review[] = [
    {
        id: "rev1",
        rideId: "r2", // assume a past version of this ride
        reviewerId: "u1",
        revieweeId: "u3",
        rating: 4,
        comment: "Good drive, reached on time. Driver was a bit quiet.",
        tags: ["Punctual", "Safe driver"],
        createdAt: "2023-09-16T10:00:00Z"
    },
    {
        id: "rev2",
        rideId: "r2",
        reviewerId: "u3",
        revieweeId: "u1",
        rating: 5,
        comment: "Great passenger, perfectly on time at pickup.",
        tags: ["Punctual", "Good passenger"],
        createdAt: "2023-09-17T09:30:00Z"
    },
    {
        id: "rev3",
        rideId: "r5",
        reviewerId: "u4",
        revieweeId: "u2",
        rating: 5,
        tags: ["Clean car", "Safe driver", "Friendly"],
        createdAt: "2023-11-01T15:20:00Z"
    }
];
