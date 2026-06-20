import React, { useState } from 'react';
import {
  Banknote,
  CalendarPlus,
  ChevronRight,
  Database,
  Download,
  Filter,
  Pencil,
  RefreshCw,
  UserPlus,
} from 'lucide-react';
import { Card } from '../../components/ui';
import Button from '../../components/ui/Button';
import { AuditActionFilter, useAdminAuditLog } from '../../features/admin/hooks';
import { AUDIT_ACTION_LABELS } from '../../features/admin/constants';
import { AuditActionType, AuditSummary } from '../../features/admin/types';
import { CompactPagination } from './AdminFeedbackPage';

const selectClass =
  'w-full px-3 py-2.5 text-sm border rounded-lg outline-none bg-white text-gray-700 border-gray-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10 transition-all';

const ACTION_STYLE: Record<AuditActionType, { badge: string; icon: React.ComponentType<{ size?: number }> }> = {
  create: { badge: 'bg-blue-50 text-blue-700', icon: UserPlus },
  update: { badge: 'bg-emerald-50 text-emerald-700', icon: Pencil },
  booking: { badge: 'bg-cyan-50 text-cyan-700', icon: CalendarPlus },
  payment: { badge: 'bg-teal-50 text-teal-700', icon: Banknote },
  backup: { badge: 'bg-slate-100 text-slate-600', icon: Database },
};

const PAGE_SIZE = 5;

export const AdminAuditLogPage: React.FC = () => {
  const {
    logs,
    summary,
    total,
    actors,
    actor,
    setActor,
    actionType,
    setActionType,
    timeframe,
    setTimeframe,
  } = useAdminAuditLog();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>
            Nhật ký Hệ thống (Audit Log)
          </h1>
          <p className="text-gray-500 dark:text-slate-400">
            Theo dõi tất cả các hành động và thay đổi trong hệ thống y tế.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<Download size={16} />}>
            Xuất báo cáo
          </Button>
          <Button leftIcon={<RefreshCw size={16} />}>Làm mới</Button>
        </div>
      </div>

      <Card padding="sm">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Khoảng thời gian</label>
            <select value={timeframe} onChange={(event) => setTimeframe(event.target.value)} className={selectClass}>
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Người thực hiện</label>
            <select value={actor} onChange={(event) => setActor(event.target.value)} className={selectClass}>
              <option value="all">Tất cả quản trị viên</option>
              {actors.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại hành động</label>
            <select
              value={actionType}
              onChange={(event) => setActionType(event.target.value as AuditActionFilter)}
              className={selectClass}
            >
              <option value="all">Tất cả hành động</option>
              {(Object.keys(AUDIT_ACTION_LABELS) as AuditActionType[]).map((type) => (
                <option key={type} value={type}>
                  {AUDIT_ACTION_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
          <Button variant="outline" leftIcon={<Filter size={16} />} onClick={() => setPage(1)}>
            Áp dụng bộ lọc
          </Button>
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-400 bg-gray-50/70 dark:bg-slate-800/60 border-b border-gray-100 dark:border-slate-700">
                <th className="px-5 py-3 font-semibold">Thời gian</th>
                <th className="px-5 py-3 font-semibold">Người thực hiện</th>
                <th className="px-5 py-3 font-semibold">Hành động</th>
                <th className="px-5 py-3 font-semibold">Đối tượng tác động</th>
                <th className="px-5 py-3 font-semibold text-right">Địa chỉ IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {logs.map((log) => {
                const style = ACTION_STYLE[log.actionType];
                const ActionIcon = style.icon;
                return (
                  <tr key={log.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-700/30">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-800 dark:text-slate-100">{log.time}</p>
                      <p className="text-xs text-gray-400">{log.timeAgo}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-9 h-9 rounded-full text-white text-xs font-semibold flex items-center justify-center ${log.actorColor}`}
                        >
                          {log.actorInitials}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 dark:text-slate-100 truncate">{log.actorName}</p>
                          <p className="text-xs text-gray-400 truncate">{log.actorRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style.badge}`}>
                        <ActionIcon size={13} />
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-slate-300">{log.target}</td>
                    <td className="px-5 py-4 text-right font-mono text-xs text-gray-500">{log.ip}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {logs.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-500">Không có hoạt động phù hợp.</div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-gray-100 dark:border-slate-700">
          <p className="text-sm text-gray-500">
            Hiển thị 1-{logs.length} trên tổng số {total.toLocaleString('vi-VN')} hoạt động
          </p>
          <CompactPagination currentPage={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-4">
        {summary.map((item) => (
          <SummaryCard key={item.id} item={item} />
        ))}
        <button
          type="button"
          className="rounded-2xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors p-5 flex items-center justify-center gap-2 text-gray-700 dark:text-slate-200 font-semibold"
        >
          Xem báo cáo chi tiết
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{ item: AuditSummary }> = ({ item }) => {
  const { label, value, note, noteTone, icon: Icon, bg, iconColor } = item;
  return (
    <div className={`rounded-2xl p-5 ${bg}`}>
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg bg-white/70 ${iconColor}`}>
          <Icon size={18} />
        </div>
        <span className={`text-xs font-semibold ${noteTone === 'danger' ? 'text-red-600' : 'text-emerald-600'}`}>
          {note}
        </span>
      </div>
      <p className="mt-3 text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold mt-0.5 text-gray-800">{value}</p>
    </div>
  );
};

export default AdminAuditLogPage;
