"use client";

import Link from "next/link";
import { useMessagesStore } from "@/lib/store/messages";
import { useRidesStore } from "@/lib/store/rides";
import { useAuthStore } from "@/lib/store/auth";
import { MOCK_USERS } from "@/lib/mock-data/users";
import { Avatar } from "@/components/ui/avatar";

export default function MessagesListPage() {
    const { user } = useAuthStore();
    const conversations = useMessagesStore(state => state.conversations);
    const getRideById = useRidesStore(state => state.getRideById);

    // The global AuthGuard handles redirection if user is null.
    if (!user) return null;

    // Filter conversations where user is a participant
    const userConversations = conversations.filter(c => c.participants.includes(user.id));

    return (
        <div className="bg-surface-bg min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl font-bold text-text-primary mb-8 bg-surface-bg sticky top-16 z-10 py-4">Messages</h1>

                <div className="space-y-2">
                    {userConversations.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-text-secondary">No messages yet.</p>
                        </div>
                    ) : (
                        userConversations.map(conversation => {
                            const otherUserId = conversation.participants.find(id => id !== user.id)!;
                            const otherUser = MOCK_USERS.find(u => u.id === otherUserId)!;
                            // Ensure ride details exist to display route
                            const ride = conversation.rideId ? getRideById(conversation.rideId) : null;

                            const unread = conversation.unreadCount?.[user.id] || 0;

                            return (
                                <Link
                                    key={conversation.id}
                                    href={`/messages/${conversation.id}`}
                                    className="flex items-center gap-4 p-4 rounded-3xl hover:bg-surface-container transition-colors"
                                >
                                    <Avatar src={otherUser.avatarUrl} verified={otherUser.isVerified} size="lg" className="shrink-0" />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`font-semibold text-base truncate ${unread > 0 ? 'text-text-primary' : 'text-text-secondary'}`}>
                                                {otherUser.name}
                                            </h3>
                                            {conversation.lastMessageAt && (
                                                <span className="text-xs text-text-secondary shrink-0 whitespace-nowrap ml-2">
                                                    {new Date(conversation.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>

                                        {ride && (
                                            <div className="text-xs font-medium text-brand-primary mb-1 truncate">
                                                {ride.origin.name} → {ride.destination.name}
                                            </div>
                                        )}

                                        <p className={`text-sm truncate ${unread > 0 ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
                                            {conversation.lastMessage || "Start a conversation"}
                                        </p>
                                    </div>

                                    {unread > 0 && (
                                        <div className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                                            {unread}
                                        </div>
                                    )}
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
