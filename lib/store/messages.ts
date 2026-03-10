import { create } from 'zustand';
import { Conversation, Message } from '@/types';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '../mock-data/messages';

interface MessagesState {
    conversations: Conversation[];
    messages: Message[];
    sendMessage: (conversationId: string, senderId: string, text: string) => void;
    markAsRead: (conversationId: string, userId: string) => void;
    getConversationMessages: (conversationId: string) => Message[];
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
    conversations: MOCK_CONVERSATIONS,
    messages: MOCK_MESSAGES,

    sendMessage: (conversationId: string, senderId: string, text: string) => {
        const newMessage: Message = {
            id: `m_${Date.now()}`,
            conversationId,
            senderId,
            text,
            createdAt: new Date().toISOString()
        };

        set((state) => ({
            messages: [...state.messages, newMessage],
            conversations: state.conversations.map(c =>
                c.id === conversationId
                    ? { ...c, lastMessage: text, lastMessageAt: newMessage.createdAt }
                    : c
            )
        }));
    },

    markAsRead: (conversationId: string, userId: string) => {
        set((state) => ({
            conversations: state.conversations.map(c => {
                if (c.id === conversationId && c.unreadCount) {
                    return {
                        ...c,
                        unreadCount: { ...c.unreadCount, [userId]: 0 }
                    };
                }
                return c;
            })
        }));
    },

    getConversationMessages: (conversationId: string) => {
        return get().messages.filter(m => m.conversationId === conversationId);
    }
}));
