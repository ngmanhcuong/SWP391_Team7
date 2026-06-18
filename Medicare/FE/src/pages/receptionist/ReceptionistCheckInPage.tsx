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

        <Card className="flex flex-col items-center text-center">
          <h2 className="self-start text-base font-semibold mb-4">Quét mã QR cá nhân</h2>
          <div className="flex aspect-square w-full max-w-[200px] items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900">
            <QrCode size={72} className="text-white/80" />
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-slate-400">
            Đặt mã QR của bệnh nhân trước camera để nhận diện nhanh
          </p>
        </Card>
      </div>

      {/* Patient detail */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar name="Trần Văn Nam" size="lg" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800">
                <CheckCircle2 size={12} className="text-white" />
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold uppercase">Trần Văn Nam</h3>
                <Badge variant="primary">BN20234582</Badge>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Nam • 42 Tuổi • SĐT: 0912 345 678
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2.5 text-emerald-700 dark:text-emerald-300">
            <Clock size={20} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide">Lịch hẹn lúc</p>
              <p className="text-base font-bold">09:30 - Hôm nay</p>
            </div>
          </div>
        </div>

        <hr className="my-5 border-gray-100 dark:border-slate-700" />

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 dark:border-slate-700 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <Stethoscope size={14} /> Bác sĩ chỉ định
            </p>
            <p className="mt-2 font-semibold">ThS.BS. Lê Hoàng Minh</p>
            <p className="text-xs text-gray-400">Khoa Tim Mạch</p>
          </div>
          <div className="rounded-xl border border-gray-100 dark:border-slate-700 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <DoorOpen size={14} /> Phòng khám
            </p>
            <p className="mt-2 font-semibold">Phòng 402 - Tầng 4</p>
            <p className="text-xs text-gray-400">Khu khám yêu cầu</p>
          </div>
          <div className="rounded-xl border border-gray-100 dark:border-slate-700 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <FileText size={14} /> Trạng thái
            </p>
            <p className="mt-2 flex items-center gap-1.5 font-semibold">
              <span className="h-2 w-2 rounded-full bg-red-500" /> Chờ Check-in
            </p>
            <p className="text-xs text-gray-400">Đã thanh toán trước</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            leftIcon={<Printer size={16} />}
            className="bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600"
          >
            In phiếu khám
          </Button>
          <Button leftIcon={<CheckCircle2 size={16} />}>Xác nhận Check-in</Button>
        </div>
      </Card>

      {/* Recent check-ins */}
      <Card padding="none" className="overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-base font-semibold">Check-in gần đây</h2>
          <button type="button" className="text-sm font-medium text-[#1a56db] hover:underline">
            Xem tất cả
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-5 py-3">Thời gian</th>
                <th className="px-3 py-3">Bệnh nhân</th>
                <th className="px-3 py-3">Mã BN</th>
                <th className="px-3 py-3">Phòng</th>
                <th className="px-3 py-3 text-right pr-5">Kết quả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {RECENT_CHECK_INS.map((item) => (
                <tr key={item.code} className="hover:bg-gray-50 dark:hover:bg-slate-700/40">
                  <td className="px-5 py-4 text-gray-500 dark:text-slate-400">{item.time}</td>
                  <td className="px-3 py-4 font-medium">{item.name}</td>
                  <td className="px-3 py-4 text-gray-500 dark:text-slate-400">{item.code}</td>
                  <td className="px-3 py-4 text-gray-500 dark:text-slate-400">{item.room}</td>
                  <td className="px-3 py-4 text-right pr-5">
                    <Badge variant="success">Hoàn tất</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReceptionistCheckInPage;
