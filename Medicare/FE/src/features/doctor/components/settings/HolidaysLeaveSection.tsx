import React, { useMemo, useState } from 'react';
import { Calendar, CalendarOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { HolidayEntry } from '../../types';
import {
  formatHolidayDateRange,
  getHolidayDurationDays,
  sortHolidaysByDate,
} from '../../utils/holidayLeaveUtils';
import HolidayFormModal from './HolidayFormModal';

interface HolidaysLeaveSectionProps {
  holidays: HolidayEntry[];
  onAdd: (entry: HolidayEntry) => void;
  onUpdate: (entry: HolidayEntry) => void;
  onRemove: (id: string) => void;
}

const typeConfig = {
  holiday: {
    label: 'Nghỉ lễ',
    badge: 'bg-[#fef2f2] text-[#dc2626] ring-1 ring-[#fecaca]',
    iconBg: 'bg-[#fef2f2]',
    iconColor: 'text-[#dc2626]',
  },
  leave: {
    label: 'Nghỉ phép',
    badge: 'bg-[#e8f0fe] text-[#003d9b] ring-1 ring-[#003d9b]/10',
    iconBg: 'bg-[#e8f0fe]',
    iconColor: 'text-[#003d9b]',
  },
} as const;

const HolidaysLeaveSection: React.FC<HolidaysLeaveSectionProps> = ({
  holidays,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<HolidayEntry | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const sortedHolidays = useMemo(() => sortHolidaysByDate(holidays), [holidays]);
  const totalDaysOff = useMemo(
    () =>
      holidays.reduce(
        (sum, holiday) => sum + getHolidayDurationDays(holiday.startDate, holiday.endDate),
        0,
      ),
    [holidays],
  );

  const openCreateModal = () => {
    setEditingHoliday(null);
    setModalOpen(true);
  };

  const openEditModal = (holiday: HolidayEntry) => {
    setEditingHoliday(holiday);
    setModalOpen(true);
  };

  const handleSubmit = (entry: HolidayEntry) => {
    if (editingHoliday) {
      onUpdate(entry);
    } else {
      onAdd(entry);
    }
  };

  return (
    <>
      <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 sm:px-6 py-4 border-b border-[#c3c6d6]/40">
          <div className="flex items-start gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fef2f2]">
              <CalendarOff size={18} className="text-[#dc2626]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#191c1e]">Ngày nghỉ lễ / phép</h2>
              <p className="text-xs text-[#737685] mt-0.5 max-w-md">
                Các ngày nghỉ sẽ tự động chặn đặt lịch trực tuyến trong khoảng thời gian tương ứng.
              </p>
            </div>
          </div>

          {holidays.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-[#737685] bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-full px-3 py-1">
                {holidays.length} khoảng nghỉ
              </span>
              <span className="text-xs font-semibold text-[#003d9b] bg-[#e8f0fe] border border-[#003d9b]/10 rounded-full px-3 py-1">
                {totalDaysOff} ngày
              </span>
            </div>
          )}
        </div>

        {sortedHolidays.length === 0 ? (
          <div className="px-5 sm:px-6 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8f9fb] text-[#737685]">
              <CalendarOff size={22} />
            </div>
            <p className="mt-3 text-sm font-medium text-[#191c1e]">Chưa có ngày nghỉ nào</p>
            <p className="mt-1 text-xs text-[#737685] max-w-sm mx-auto">
              Thêm ngày nghỉ lễ hoặc nghỉ phép để hệ thống không nhận lịch hẹn trong thời gian đó.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#c3c6d6]/20">
            {sortedHolidays.map((holiday) => {
              const holidayType = holiday.type ?? 'holiday';
              const config = typeConfig[holidayType];
              const duration = getHolidayDurationDays(holiday.startDate, holiday.endDate);
              const isDeleting = pendingDeleteId === holiday.id;

              return (
                <li
                  key={holiday.id}
                  className="group px-5 sm:px-6 py-4 hover:bg-[#f8f9fb]/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}
                    >
                      <Calendar size={17} className={config.iconColor} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[#191c1e]">{holiday.title}</p>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${config.badge}`}
                        >
                          {config.label}
                        </span>
                        <span className="text-[10px] font-semibold text-[#737685] bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-full px-2 py-0.5">
                          {duration} ngày
                        </span>
                      </div>
                      <p className="text-xs text-[#737685] mt-1.5">
                        {formatHolidayDateRange(holiday)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isDeleting ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              onRemove(holiday.id);
                              setPendingDeleteId(null);
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#dc2626] hover:bg-[#b91c1c] transition-colors"
                          >
                            Xóa
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(null)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#434654] hover:bg-[#f8f9fb] transition-colors"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => openEditModal(holiday)}
                            className="p-2 rounded-lg text-[#737685] sm:opacity-0 sm:group-hover:opacity-100 hover:text-[#003d9b] hover:bg-[#e8f0fe] transition-all"
                            aria-label={`Sửa ${holiday.title}`}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(holiday.id)}
                            className="p-2 rounded-lg text-[#737685] hover:text-[#dc2626] hover:bg-[#fef2f2] transition-colors"
                            aria-label={`Xóa ${holiday.title}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="px-5 sm:px-6 py-4 border-t border-[#c3c6d6]/30 bg-[#f8f9fb]/30">
          <button
            type="button"
            onClick={openCreateModal}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#c3c6d6]/70 text-sm font-semibold text-[#434654] hover:border-[#003d9b]/50 hover:text-[#003d9b] hover:bg-white transition-colors"
          >
            <Plus size={16} />
            Thêm ngày nghỉ mới
          </button>
        </div>
      </div>

      <HolidayFormModal
        open={modalOpen}
        editingHoliday={editingHoliday}
        onClose={() => {
          setModalOpen(false);
          setEditingHoliday(null);
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default HolidaysLeaveSection;
