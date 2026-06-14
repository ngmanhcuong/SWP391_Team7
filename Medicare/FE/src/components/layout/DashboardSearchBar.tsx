import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

interface DashboardSearchBarProps {
  placeholder?: string;
  searchHref?: string;
  buttonLabel?: string;
  title?: string;
  className?: string;
}

const DashboardSearchBar: React.FC<DashboardSearchBarProps> = ({
  placeholder = 'Nhập chuyên khoa, tên bác sĩ...',
  searchHref = '/bac-si',
  buttonLabel = 'Tìm kiếm',
  title = 'Tìm kiếm nhanh',
  className = '',
}) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 ${className}`}>
    <p className="text-sm font-medium text-gray-700 mb-3">{title}</p>
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#1a56db] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <Search size={18} className="text-gray-400 flex-shrink-0" />
        <input
          type="search"
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-400"
        />
      </div>
      <Link to={searchHref} className="sm:flex-shrink-0">
        <Button size="md" fullWidth className="sm:w-auto sm:min-w-[140px]" leftIcon={<Calendar size={16} />}>
          {buttonLabel}
        </Button>
      </Link>
    </div>
  </div>
);

export default DashboardSearchBar;
