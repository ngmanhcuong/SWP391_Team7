const BrandLogo = ({ compact = false }) => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a56db]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" fill="white" />
        </svg>
      </div>
      <div className="min-w-0">
        <p
          className={`truncate font-bold tracking-tight text-[#111827] ${compact ? 'text-sm' : 'text-base'}`}
          style={{ fontFamily: 'Lexend' }}
        >
          {compact ? 'MediCare' : 'MediCare AI Clinic'}
        </p>
        {!compact && (
          <p className="truncate text-xs font-medium text-[#1a56db]">Hệ thống quản lý y tế</p>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
