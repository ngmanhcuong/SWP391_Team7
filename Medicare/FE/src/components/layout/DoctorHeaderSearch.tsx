import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Search, UserRound, X } from 'lucide-react';
import { searchDoctorHeader } from './searchDoctorHeader';
import { DOCTOR_PATHS } from '../../features/doctor/utils/doctorPaths';

interface DoctorHeaderSearchProps {
  compact?: boolean;
}

const DoctorHeaderSearch: React.FC<DoctorHeaderSearchProps> = ({ compact = false }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchDoctorHeader(query), [query]);
  const hasQuery = query.trim().length >= 2;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (compact) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        const input = containerRef.current?.querySelector('input');
        input?.focus();
        setOpen(true);
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [compact]);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery('');
    navigate(href);
  };

  if (compact) {
    return (
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="p-2 text-[#434654] hover:bg-[#f8f9fb] rounded-lg transition-colors"
          aria-label="Tìm kiếm"
        >
          <Search size={18} />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-[min(320px,calc(100vw-2rem))] bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-xl shadow-[#003d9b]/10 z-50 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#c3c6d6]/30">
              <Search size={16} className="text-[#737685] shrink-0" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm BN, lịch hẹn..."
                className="flex-1 bg-transparent text-sm outline-none min-w-0"
                autoFocus
              />
            </div>
            <SearchPanel
              query={query}
              results={results}
              hasQuery={hasQuery}
              onSelect={handleSelect}
              onClose={() => setOpen(false)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl min-w-0">
      <div
        className={`flex items-center gap-3 px-4 py-2.5 bg-[#f8f9fb] rounded-xl border transition-all ${
          open
            ? 'border-[#003d9b]/40 ring-2 ring-[#003d9b]/10 bg-white'
            : 'border-[#c3c6d6]/50'
        }`}
      >
        <Search size={18} className="text-[#737685] shrink-0" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Tìm bệnh nhân, mã BN, lịch hẹn..."
          className="flex-1 bg-transparent text-sm text-[#191c1e] placeholder:text-[#737685] outline-none min-w-0"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setOpen(false);
            }}
            className="p-1 rounded-md text-[#737685] hover:bg-[#e8f0fe]"
            aria-label="Xóa tìm kiếm"
          >
            <X size={14} />
          </button>
        )}
        <kbd className="hidden xl:inline-flex text-[10px] font-medium text-[#737685] bg-white border border-[#c3c6d6]/60 px-1.5 py-0.5 rounded">
          Ctrl+K
        </kbd>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-xl shadow-[#003d9b]/10 z-50 overflow-hidden">
          <SearchPanel
            query={query}
            results={results}
            hasQuery={hasQuery}
            onSelect={handleSelect}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

interface SearchPanelProps {
  query: string;
  results: ReturnType<typeof searchDoctorHeader>;
  hasQuery: boolean;
  onSelect: (href: string) => void;
  onClose: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({
  query,
  results,
  hasQuery,
  onSelect,
  onClose,
}) => (
  <div className="p-2">
    <div className="px-3 py-2 border-b border-[#c3c6d6]/30">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#737685]">Tìm kiếm nhanh</p>
    </div>

    {!hasQuery ? (
      <div className="px-3 py-4 text-xs text-[#737685] space-y-2">
        <p>Nhập tên BN, mã BN hoặc giờ hẹn (tối thiểu 2 ký tự).</p>
        <div className="flex flex-wrap gap-2">
          <Link
            to={DOCTOR_PATHS.patients}
            onClick={onClose}
            className="text-[#003d9b] font-semibold hover:underline"
          >
            Danh sách BN
          </Link>
          <Link
            to={DOCTOR_PATHS.schedule}
            onClick={onClose}
            className="text-[#003d9b] font-semibold hover:underline"
          >
            Lịch khám
          </Link>
        </div>
      </div>
    ) : results.length === 0 ? (
      <p className="px-3 py-6 text-sm text-[#737685] text-center">Không tìm thấy kết quả phù hợp.</p>
    ) : (
      <ul className="max-h-[280px] overflow-y-auto py-1">
        {results.map((result) => {
          const Icon = result.type === 'patient' ? UserRound : Calendar;
          return (
            <li key={result.id}>
              <button
                type="button"
                onClick={() => onSelect(result.href)}
                className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-[#f8f9fb] text-left transition-colors"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e8f0fe] text-[#003d9b]">
                  <Icon size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[#191c1e] truncate">{result.title}</span>
                  <span className="block text-xs text-[#737685] truncate">{result.subtitle}</span>
                  {result.meta && (
                    <span className="block text-[11px] text-[#737685] truncate mt-0.5">{result.meta}</span>
                  )}
                </span>
                <span className="text-[10px] font-bold uppercase text-[#003d9b] shrink-0">
                  {result.type === 'patient' ? 'BN' : 'Lịch'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

export default DoctorHeaderSearch;
