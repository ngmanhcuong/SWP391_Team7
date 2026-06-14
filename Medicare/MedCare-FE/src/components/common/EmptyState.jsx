const EmptyState = ({ title = 'Không có dữ liệu', description = 'Nội dung sẽ hiển thị tại đây.' }) => {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center shadow-sm">
      <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Lexend' }}>
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default EmptyState;
