import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  isError?: boolean;
}

export const CHAT_GREETING =
  'Xin chào! Tôi là trợ lý sức khỏe MediCare AI. Tôi có thể giúp gì cho bạn hôm nay?';

const createInitialMessages = (): ChatMessage[] => [
  { id: 1, sender: 'bot', text: CHAT_GREETING },
];

interface ChatState {
  messages: ChatMessage[];
  unread: number;
  open: boolean;
  addMessage: (message: ChatMessage) => void;
  markAllRead: () => void;
  bumpUnread: () => void;
  setOpen: (open: boolean) => void;
  reset: () => void;
}

// Lịch sử trò chuyện được lưu theo phiên đăng nhập (persist vào localStorage),
// giữ lại khi chuyển trang / tải lại trang và chỉ bị xóa khi người dùng đăng xuất.
export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: createInitialMessages(),
      unread: 1,
      open: false,
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      markAllRead: () => set({ unread: 0 }),
      bumpUnread: () => set((state) => ({ unread: state.unread + 1 })),
      setOpen: (open) => set({ open }),
      reset: () => set({ messages: createInitialMessages(), unread: 1, open: false }),
    }),
    { name: 'medicare-chat-history' },
  ),
);
