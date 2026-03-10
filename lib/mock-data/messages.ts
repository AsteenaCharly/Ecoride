import { Conversation, Message } from "@/types";

export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: "c1",
        rideId: "r1",
        participants: ["u1", "u2"],
        lastMessage: "Sounds good, see you there!",
        lastMessageAt: "2023-10-24T11:05:00Z",
        unreadCount: { "u1": 0, "u2": 0 }
    },
    {
        id: "c2",
        rideId: "r3",
        participants: ["u1", "u4"],
        lastMessage: "Can I bring a small backpack?",
        lastMessageAt: "2023-10-25T08:15:00Z",
        unreadCount: { "u1": 1, "u4": 0 }
    }
];

export const MOCK_MESSAGES: Message[] = [
    { id: "m1", conversationId: "c1", senderId: "u1", text: "Hi Priya, where exactly in Mumbai will you start?", createdAt: "2023-10-24T10:45:00Z" },
    { id: "m2", conversationId: "c1", senderId: "u2", text: "I'll be starting from Andheri West, near the station.", createdAt: "2023-10-24T10:50:00Z" },
    { id: "m3", conversationId: "c1", senderId: "u1", text: "Perfect, I can meet you there.", createdAt: "2023-10-24T11:00:00Z" },
    { id: "m4", conversationId: "c1", senderId: "u2", text: "Sounds good, see you there!", createdAt: "2023-10-24T11:05:00Z" },

    { id: "m5", conversationId: "c2", senderId: "u1", text: "Can I bring a small backpack?", createdAt: "2023-10-25T08:15:00Z" }
];
