import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { aiApi, AiChatMessage } from '../api/aiApi';
import { useChatStore, type ChatMessage } from '../../../store/chatStore';

interface FloatingChatButtonProps {
  onClick?: () => void;
}

const QUICK_PROMPTS = [
  'Đặt lịch khám',
  'Xem kết quả xét nghiệm',
  'Tư vấn triệu chứng',
];

// Render text có hỗ trợ in đậm bằng cú pháp **...** (dùng để in đậm tên chuyên khoa)
const renderRichText = (text: string): React.ReactNode =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });

const toChatHistory = (messages: ChatMessage[]): AiChatMessage[] =>
  messages
    .filter((message) => !message.isError)
    .map((message) => ({
      role: message.sender === 'user' ? 'user' : 'model',
      text: message.text,
    }));

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => {
  const messages = useChatStore((state) => state.messages);
  const unread = useChatStore((state) => state.unread);
  const addMessage = useChatStore((state) => state.addMessage);
  const markAllRead = useChatStore((state) => state.markAllRead);
  const bumpUnread = useChatStore((state) => state.bumpUnread);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      markAllRead(); // mở chat = đã đọc hết
    }
  }, [open, markAllRead]);

  const handleToggle = () => {
    if (onClick) {
      onClick();
      return;
    }
    setOpen((prev) => !prev);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage: ChatMessage = { id: Date.now(), sender: 'user', text: trimmed };
    const history = toChatHistory([...messages, userMessage]);

    addMessage(userMessage);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await aiApi.chat(history);
      addMessage({ id: Date.now() + 1, sender: 'bot', text: reply });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Trợ lý AI hiện không phản hồi được. Vui lòng thử lại sau ít phút.';
      addMessage({ id: Date.now() + 1, sender: 'bot', text: message, isError: true });
    } finally {
      setIsTyping(false);
      // Nếu người dùng đã đóng chat trước khi bot trả lời -> đánh dấu chưa đọc
      if (!openRef.current) {
        bumpUnread();
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-[20px] border border-slate-200/70 bg-white shadow-2xl shadow-slate-900/20 animate-[fadeUp_0.2s_ease-out]">
          {/* Header */}
          <div className="relative flex items-center gap-3 bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#06b6d4] px-4 py-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">Trợ lý sức khỏe AI</p>
              <p className="flex items-center gap-1.5 text-xs text-blue-50/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Thường trả lời ngay
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              aria-label="Đóng chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="h-[340px] space-y-3 overflow-y-auto overscroll-contain bg-[#f8fafc] p-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.sender === 'user'
                      ? 'rounded-br-md bg-[#2563eb] text-white'
                      : message.isError
                        ? 'rounded-bl-md border border-red-200 bg-red-50 text-red-600 shadow-sm'
                        : 'rounded-bl-md border border-slate-200/70 bg-white text-slate-700 shadow-sm'
                  }`}
                >
                  {message.sender === 'bot' ? renderRichText(message.text) : message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200/70 bg-white px-3.5 py-3 shadow-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" />
                </div>
              </div>
            )}

            {messages.length <= 1 && !isTyping && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border border-[#2563eb]/30 bg-white px-3 py-1.5 text-xs font-medium text-[#2563eb] transition-colors hover:bg-[#2563eb]/5"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-200/70 bg-white p-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/10"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#06b6d4] text-white shadow-md shadow-blue-500/30 transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Gửi"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={handleToggle}
        className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#06b6d4] text-white shadow-lg shadow-blue-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50"
        aria-label={open ? 'Đóng chat hỗ trợ' : 'Mở chat hỗ trợ'}
      >
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#2563eb]/40 opacity-75 animate-ping group-hover:opacity-0" />
        )}
        {open ? (
          <X size={24} className="relative" />
        ) : (
          <MessageCircle size={24} className="relative transition-transform duration-300 group-hover:rotate-6" />
        )}
        {!open && unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ba1a1a] px-1 text-xs font-semibold text-white ring-2 ring-white">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>
    </>
  );
};

export default FloatingChatButton;
