import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingChatButtonProps {
  unreadCount?: number;
  onClick?: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ unreadCount = 0, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#003d9b] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#002d75] transition-colors"
    aria-label="Mở chat hỗ trợ"
  >
    <MessageCircle size={24} />
    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#ba1a1a] text-white text-xs font-medium rounded-full flex items-center justify-center">
        {unreadCount}
      </span>
    )}
  </button>
);

export default FloatingChatButton;
