import { MessageCircle } from 'lucide-react';

const FloatingChatButton = () => {
  return (
    <button
      type="button"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a56db] text-white shadow-lg shadow-blue-500/30 transition-transform hover:scale-105"
      aria-label="Mở chat hỗ trợ"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-medium">
        2
      </span>
    </button>
  );
};

export default FloatingChatButton;
