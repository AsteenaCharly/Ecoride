"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMessagesStore } from "@/lib/store/messages";
import { useAuthStore } from "@/lib/store/auth";
import { useRidesStore } from "@/lib/store/rides";
import { MOCK_USERS } from "@/lib/mock-data/users";
import { Avatar } from "@/components/ui/avatar";
import { ArrowLeft, Send } from "lucide-react";

export default function ChatViewPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuthStore();

    const conversation = useMessagesStore(state => state.conversations.find(c => c.id === id));
    const allMessages = useMessagesStore(state => state.messages);
    const messages = allMessages.filter(m => m.conversationId === id);
    const sendMessage = useMessagesStore(state => state.sendMessage);
    const markAsRead = useMessagesStore(state => state.markAsRead);
    const getRideById = useRidesStore(state => state.getRideById);

    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user && conversation) {
            markAsRead(conversation.id, user.id);
        }
    }, [user, conversation, messages, markAsRead]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    if (!user || !conversation) return null;

    const otherUserId = conversation.participants.find(uid => uid !== user.id)!;
    const otherUser = MOCK_USERS.find(u => u.id === otherUserId)!;
    const ride = conversation.rideId ? getRideById(conversation.rideId) : null;

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        sendMessage(conversation.id, user.id, text.trim());
        setText("");

        // Simulate driver reply
        setIsTyping(true);
        setTimeout(() => {
            const replies = [
                "Sure, no problem!",
                "Yes, I'll be there on time.",
                "Okay great.",
                "Let me check and get back to you.",
                "Sounds good."
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            sendMessage(conversation.id, otherUserId, randomReply);
            setIsTyping(false);
        }, 2500 + Math.random() * 2000);
    };

    return (
        <div className="bg-surface-bg flex flex-col h-[calc(100vh-64px)] fixed inset-x-0 w-full z-50">
            {/* Header */}
            <div className="bg-surface-container border-b border-surface-outline/10 h-16 flex items-center px-4 shrink-0">
                <button onClick={() => router.back()} className="mr-4">
                    <ArrowLeft className="w-6 h-6 text-text-primary" />
                </button>
                <Avatar src={otherUser.avatarUrl} size="md" />
                <div className="ml-3">
                    <h2 className="font-semibold text-text-primary leading-tight">{otherUser.name}</h2>
                    {ride && (
                        <div className="text-xs text-brand-primary font-medium tracking-tight">
                            {ride.origin.name} → {ride.destination.name}
                        </div>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
                {messages.map((m) => {
                    const isOwn = m.senderId === user.id;
                    return (
                        <div key={m.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${isOwn
                                    ? 'bg-brand-primary text-white rounded-tr-sm'
                                    : 'bg-surface-container border border-surface-outline/10 text-text-primary rounded-tl-sm'
                                    }`}
                            >
                                <div className="text-[15px]">{m.text}</div>
                                <div className={`text-[10px] mt-1 text-right ${isOwn ? 'text-brand-primary10' : 'text-text-secondary'}`}>
                                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {isTyping && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                        <div className="bg-surface-container border border-surface-outline/10 px-4 py-3.5 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                            <div className="w-2 h-2 bg-text-secondary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 bg-text-secondary/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 bg-text-secondary/50 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-surface-bg border-t border-surface-outline/10 p-4 shrink-0 pb-safe absolute bottom-0 w-full">
                <form onSubmit={handleSend} className="relative flex items-center">
                    <input
                        type="text"
                        placeholder="Write a message..."
                        className="w-full h-12 bg-surface-container border border-surface-outline/20 rounded-full pl-5 pr-12 outline-none focus:border-brand-primary text-[15px]"
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={!text.trim()}
                        className="absolute right-2 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
