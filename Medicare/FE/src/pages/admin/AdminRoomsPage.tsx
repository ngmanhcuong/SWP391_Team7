import React, { useMemo, useState } from 'react';
import { Filter, Pencil, Plus, Trash2 } from 'lucide-react';
import { Card, Modal } from '../../components/ui';
import Button from '../../components/ui/Button';
import { AdminRoomInput, useAdminRooms } from '../../features/admin/hooks';
import { ROOM_STATUS_LABELS } from '../../features/admin/constants';
import { AdminRoom, RoomStatus } from '../../features/admin/types';
import { Pagination, SectionStatCard } from './AdminDoctorsPage';

const PAGE_SIZE = 6;

const selectClass =
  'w-full px-4 py-2.5 text-sm border rounded-xl outline-none bg-white text-gray-700 border-gray-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10 transition-all';

const EMPTY_ROOM: AdminRoomInput = {
  name: '',
  department: '',
  status: 'available',
};

const STATUS_DOT: Record<RoomStatus, string> = {
  available: 'bg-emerald-500',
  in_use: 'bg-[#1a56db]',
  maintenance: 'bg-red-500',
};

const STATUS_TEXT: Record<RoomStatus, string> = {
  available: 'text-emerald-600',
  in_use: 'text-[#1a56db]',
  maintenance: 'text-red-500',
};

export const AdminRoomsPage: React.FC = () => {
  const {
    rooms,
    stats,
    departments,
    total,
    department,
    setDepartment,
    statusFilter,
    setStatusFilter,
    refreshRooms,
  } = useAdminRooms();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminRoom | null>(null);
  const [form, setForm] = useState<AdminRoomInput>(EMPTY_ROOM);
  const [error, setError] = useState('');

  const totalPages = Math.max(1, Math.ceil(rooms.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = useMemo(() => rooms.slice(start, start + PAGE_SIZE), [rooms, start]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_ROOM, department: departments[0] ?? '' });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (room: AdminRoom) => {
    setEditing(room);
    setForm({ name: room.name, department: room.department, status: room.status });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(
      'Trang này đang dùng dữ liệu thật từ hệ thống. Chức năng thêm hoặc sửa phòng sẽ được nối API riêng sau.',
    );
  };

  return (
    <div className="relative space-y-6 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>
            Quản lý Phòng khám
          </h1>
          <p className="text-gray-500 dark:text-slate-400">
            Quản lý danh sách, trạng thái và phân bổ phòng khám bệnh theo dữ liệu thật của hệ thống
          </p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openCreate}>
          Thêm phòng mới
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <SectionStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <Card padding="sm">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Lọc theo khoa</label>
            <select
              value={department}
              onChange={(event) => {
                setDepartment(event.target.value);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="all">Tất cả các khoa</option>
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as typeof statusFilter);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="available">{ROOM_STATUS_LABELS.available}</option>
              <option value="in_use">{ROOM_STATUS_LABELS.in_use}</option>
              <option value="maintenance">{ROOM_STATUS_LABELS.maintenance}</option>
            </select>
          </div>
          <Button
            variant="outline"
            leftIcon={<Filter size={16} />}
            onClick={() => {
              setPage(1);
              refreshRooms();
            }}
          >
            Áp dụng lọc
          </Button>
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-slate-400 border-b border-gray-100 dark:border-slate-700">
                <th className="px-5 py-3 font-medium">Mã phòng</th>
                <th className="px-5 py-3 font-medium">Tên phòng</th>
                <th className="px-5 py-3 font-medium">Khoa phụ trách</th>
                <th className="px-5 py-3 font-medium">Trạng thái</th>
                <th className="px-5 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {pageItems.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-700/30">
                  <td className="px-5 py-3 font-semibold text-[#1a56db]">{room.id}</td>
                  <td className="px-5 py-3 text-gray-800 dark:text-slate-100">{room.name}</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-slate-300">{room.department}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-2 text-sm font-medium">
                      <span className={`w-2 h-2 rounded-full ${STATUS_DOT[room.status]}`} />
                      <span className={STATUS_TEXT[room.status]}>{ROOM_STATUS_LABELS[room.status]}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Sửa"
                        onClick={() => openEdit(room)}
                        className="p-2 rounded-lg text-gray-300 cursor-not-allowed"
                        disabled
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        title="Xóa"
                        className="p-2 rounded-lg text-gray-300 cursor-not-allowed"
                        disabled
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pageItems.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-500">
              Không có phòng phù hợp bộ lọc.
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-gray-100 dark:border-slate-700">
          <p className="text-sm text-gray-500">
            Hiển thị {rooms.length === 0 ? 0 : start + 1} - {start + pageItems.length} của {total}{' '}
            phòng
          </p>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={(value) => setPage(value)} />
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
        description={
          editing ? `Mã phòng: ${editing.id}` : 'Phòng khám đang được đồng bộ từ dữ liệu bác sĩ trong hệ thống'
        }
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" form="room-form" leftIcon={<Plus size={16} />}>
              {editing ? 'Lưu thay đổi' : 'Tạo phòng'}
            </Button>
          </>
        }
      >
        <form id="room-form" onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-50 text-sm text-red-600">{error}</div>}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Tên phòng <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              placeholder="VD: Phòng XK001 - Khoa Cơ xương khớp"
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className={selectClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Khoa phụ trách <span className="text-red-500">*</span>
            </label>
            <input
              list="room-department-options"
              value={form.department}
              placeholder="Chọn hoặc nhập khoa"
              onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
              className={selectClass}
            />
            <datalist id="room-department-options">
              {departments.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Trạng thái</label>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, status: event.target.value as RoomStatus }))
              }
              className={selectClass}
            >
              <option value="available">{ROOM_STATUS_LABELS.available}</option>
              <option value="in_use">{ROOM_STATUS_LABELS.in_use}</option>
              <option value="maintenance">{ROOM_STATUS_LABELS.maintenance}</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminRoomsPage;
