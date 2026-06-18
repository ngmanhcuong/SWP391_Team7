import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  DoorOpen,
  FileText,
  Printer,
  QrCode,
  Search,
  Stethoscope,
  UserSearch,
} from 'lucide-react';
import { Avatar, Badge, Card } from '../../components/ui';
import Button from '../../components/ui/Button';

interface RecentCheckIn {
  time: string;
  name: string;
  code: string;
  room: string;
}

const RECENT_CHECK_INS: RecentCheckIn[] = [
  { time: '09:12', name: 'Nguyễn Thị Hằng', code: 'BN20234571', room: 'Phòng 201' },
  { time: '09:05', name: 'Phạm Anh Tuấn', code: 'BN20234560', room: 'Phòng 105' },
];

const ReceptionistCheckInPage: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#1a56db]" style={{ fontFamily: 'Lexend' }}>
        Check-in nhanh
      </h1>

      {/* Search + QR */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <h2 className="text-base font-semibold mb-4">Tìm kiếm bệnh nhân</h2>
          <div className="flex items-center gap-2 rounded-xl border-2 border-[#1a56db]/30 bg-white dark:bg-slate-900 px-3 py-2 focus-within:border-[#1a56db] transition-colors">
            <UserSearch size={20} className="text-[#1a56db] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập Mã BN, CCCD hoặc Số điện thoại"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
            <Button size="sm" leftIcon={<Search size={15} />}>
              Tìm kiếm
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-gray-100 dark:bg-slate-700 px-2.5 py-1 text-xs text-gray-500 dark:text-slate-300">
              Gợi ý: BN2023001
            </span>
            <span className="rounded-md bg-gray-100 dark:bg-slate-700 px-2.5 py-1 text-xs text-gray-500 dark:text-slate-300">
              0987-XXX-XXX
            </span>
          </div>
        </Card>
