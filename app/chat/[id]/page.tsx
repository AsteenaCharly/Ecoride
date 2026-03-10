"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { MOCK_USERS } from "@/lib/mock-data/users";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Phone, MoreVertical, ShieldCheck } from "lucide-react";

type Message = {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
};

export default function ChatPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "m1",
            senderId: id as string,
            text: "Hi! Are we still on for the ride tomorrow?",
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        },
        {
            id: "m2",
            senderId: user?.id || "u1",
            text: "Yes, definitely! I'll be at the pickup spot on time.",
            timestamp: new Date(Date.now() - 3500000), // 58 minutes ago
        }
    ]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const chatPartner = MOCK_USERS.find(u => u.id === id);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!user || !chatPartner) {
        return (
            <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">User not found</h2>
                    <Button onClick={() => router.back()} variant="outline">Go back</Button>
                </div>
            </div>
        );
    }

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: user.id,
            text: inputText.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText("");

        // Simulate reply from other user after 1-2 seconds
        setTimeout(() => {
            const replyMessage: Message = {
                id: (Date.now() + 1).toString(),
                senderId: chatPartner.id,
                text: "Sounds good! See you soon. Drive safe!",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, replyMessage]);
        }, 1500 + Math.random() * 1000);
    };

    return (
        <div className="bg-surface-bg min-h-screen flex flex-col max-w-3xl mx-auto border-x border-surface-outline/10 h-[100dvh]">
            {/* Chat Header */}
            <div className="bg-surface-container border-b border-surface-outline/10 sticky top-0 md:top-16 z-30 shrink-0">
                <div className="px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="text-text-primary hover:text-brand-primary transition-colors p-2 -ml-2">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <Avatar src={chatPartner.avatarUrl} alt={chatPartner.name} size="md" />
                        <div>
                            <div className="font-bold text-text-primary flex items-center gap-1">
                                {chatPartner.name}
                                {chatPartner.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />}
                            </div>
                            <div className="text-xs text-brand-primary">Online</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => alert(`Calling ${chatPartner.name}...`)} className="text-brand-primary">
                            <Phone className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-text-secondary">
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="text-center text-xs text-text-secondary my-6">
                    Chat started connected to booking
                </div>

                {messages.map((msg, index) => {
                    const isMe = msg.senderId === user.id;
                    const showTime = index === messages.length - 1 ||
                        new Date(messages[index + 1].timestamp).getTime() - msg.timestamp.getTime() > 300000; // 5 min diff

                    return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div
                                className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${isMe
                                    ? 'bg-brand-primary text-white rounded-br-sm'
                                    : 'bg-surface-container border border-surface-outline/10 text-text-primary rounded-bl-sm'
                                    }`}
                            >
                                <p className="text-[15px] leading-relaxed">{msg.text}</p>
                            </div>
                            {showTime && (
                                <span className="text-[10px] text-text-secondary mt-1 px-1">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} className="h-2 w-full" />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-surface-bg border-t border-surface-outline/10 shrink-0">
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-end gap-2 bg-surface-container rounded-3xl p-1.5 border border-surface-outline/20 focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary transition-all"
                >
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent resize-none outline-none py-2.5 px-4 text-text-primary max-h-32 min-h-[44px]"
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!inputText.trim()}
                        className={`rounded-full shrink-0 w-11 h-11 transition-all ${inputText.trim()
                            ? 'bg-brand-primary text-white shadow-md hover:bg-brand-primary90'
                            : 'bg-surface-low text-text-tertiary border border-surface-outline/10'
                            }`}
                    >
                        <Send className="w-5 h-5 -ml-0.5 mt-0.5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
