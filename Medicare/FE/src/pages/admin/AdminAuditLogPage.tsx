import React, { useMemo, useState } from 'react';
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
import { AuditActionType, AuditLogEntry, AuditSummary } from '../../features/admin/types';
import { CompactPagination } from './AdminFeedbackPage';

const selectClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10';

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
    refreshAuditLogs,
  } = useAdminAuditLog();

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return logs.slice(start, start + PAGE_SIZE);
  }, [logs, page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-bold" style={{ fontFamily: 'Lexend' }}>
            Nhật ký hệ thống (Audit Log)
          </h1>
          <p className="text-gray-500 dark:text-slate-400">
            Theo dõi các hoạt động thực tế đang phát sinh trong hệ thống y tế.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<Download size={16} />}>
            Xuất báo cáo
          </Button>
          <Button leftIcon={<RefreshCw size={16} />} onClick={() => refreshAuditLogs()}>
            Làm mới
          </Button>
        </div>
      </div>

      <Card padding="sm">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Khoảng thời gian</label>
            <select
              value={timeframe}
              onChange={(event) => {
                setTimeframe(event.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Người thực hiện</label>
            <select
              value={actor}
              onChange={(event) => {
                setActor(event.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="all">Tất cả</option>
              {actors.map((item: string) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Loại hành động</label>
            <select
              value={actionType}
              onChange={(event) => {
                setActionType(event.target.value as AuditActionFilter);
                setPage(1);
              }}
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
              <tr className="border-b border-gray-100 bg-gray-50/70 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 dark:border-slate-700 dark:bg-slate-800/60">
                <th className="px-5 py-3">Thời gian</th>
                <th className="px-5 py-3">Người thực hiện</th>
                <th className="px-5 py-3">Hành động</th>
                <th className="px-5 py-3">Đối tượng tác động</th>
                <th className="px-5 py-3 text-right">Địa chỉ IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {pageItems.map((log: AuditLogEntry) => {
                const style = ACTION_STYLE[log.actionType];
                const ActionIcon = style.icon;
                return (
                  <tr key={log.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-700/30">
                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="font-medium text-gray-800 dark:text-slate-100">{log.time}</p>
                      <p className="text-xs text-gray-400">{log.timeAgo}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white ${log.actorColor}`}
                        >
                          {log.actorInitials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-800 dark:text-slate-100">{log.actorName}</p>
                          <p className="truncate text-xs text-gray-400">{log.actorRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}>
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

          {pageItems.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-500">Không có hoạt động phù hợp.</div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 p-4 dark:border-slate-700">
          <p className="text-sm text-gray-500">
            Hiển thị {pageItems.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{(page - 1) * PAGE_SIZE + pageItems.length} trên tổng số {total.toLocaleString('vi-VN')} hoạt động
          </p>
          <CompactPagination currentPage={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-4">
        {summary.map((item: AuditSummary) => (
          <SummaryCard key={item.id} item={item} />
        ))}
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-2xl bg-gray-100 p-5 font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
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
        <div className={`rounded-lg bg-white/70 p-2 ${iconColor}`}>
          <Icon size={18} />
        </div>
        <span className={`text-xs font-semibold ${noteTone === 'danger' ? 'text-red-600' : 'text-emerald-600'}`}>
          {note}
        </span>
      </div>
      <p className="mt-3 text-sm text-gray-600">{label}</p>
      <p className="mt-0.5 text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default AdminAuditLogPage;
