const Loading = ({ message = 'Đang tải...' }) => {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#1a56db] border-t-transparent" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default Loading;
