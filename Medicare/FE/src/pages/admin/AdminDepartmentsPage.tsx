import React, { useState } from 'react';
import { Building2, LayoutGrid, List, Pencil, Plus, Trash2, UserRound } from 'lucide-react';
import { Card, Modal } from '../../components/ui';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
  AdminDepartmentInput,
  DepartmentSort,
  useAdminDepartments,
} from '../../features/admin/hooks';
import { AdminDepartment } from '../../features/admin/types';
import { SectionStatCard } from './AdminDoctorsPage';

const SORT_LABELS: Record<DepartmentSort, string> = {
  'name-asc': 'Tên khoa (A-Z)',
  'name-desc': 'Tên khoa (Z-A)',
  'doctors-desc': 'Số bác sĩ nhiều nhất',
};

const COLOR_OPTIONS: { label: string; value: string }[] = [
  { label: 'Xanh dương', value: 'from-blue-500 to-blue-700' },
  { label: 'Xanh lá', value: 'from-emerald-500 to-emerald-700' },
  { label: 'Tím', value: 'from-violet-500 to-violet-700' },
  { label: 'Hồng', value: 'from-pink-500 to-rose-700' },
  { label: 'Cam', value: 'from-amber-500 to-orange-700' },
  { label: 'Xanh ngọc', value: 'from-cyan-500 to-teal-700' },
];

const EMPTY_FORM: AdminDepartmentInput = {
  name: '',
  description: '',
  doctorCount: 0,
  color: COLOR_OPTIONS[0].value,
};

export const AdminDepartmentsPage: React.FC = () => {
  const { departments, stats, sort, setSort, deleteDepartment, addDepartment, updateDepartment } =
    useAdminDepartments();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminDepartment | null>(null);
  const [form, setForm] = useState<AdminDepartmentInput>(EMPTY_FORM);
  const [error, setError] = useState('');

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (dept: AdminDepartment) => {
    setEditing(dept);
    setForm({
      name: dept.name,
      description: dept.description,
      doctorCount: dept.doctorCount,
      color: dept.color,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('Vui lòng nhập tên khoa.');
      return;
    }
    if (editing) {
      updateDepartment(editing.id, form);
    } else {
      addDepartment(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="relative space-y-6 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>
            Quản lý Khoa khám
          </h1>
          <p className="text-gray-500 dark:text-slate-400">
            Quản lý cấu trúc tổ chức và phân bổ bác sĩ cho các khoa.
          </p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={openCreate}>
          Thêm khoa mới
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <SectionStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100">
          <button
            type="button"
            onClick={() => setView('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              view === 'grid' ? 'bg-[#1a56db] text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Dạng lưới"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition-colors ${
              view === 'list' ? 'bg-[#1a56db] text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Dạng danh sách"
          >
            <List size={16} />
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-500">
          Sắp xếp:
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as DepartmentSort)}
            className="px-3 py-2 text-sm border rounded-lg outline-none bg-white text-gray-700 border-gray-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10"
          >
            {(Object.keys(SORT_LABELS) as DepartmentSort[]).map((value) => (
              <option key={value} value={value}>
                {SORT_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={view === 'grid' ? 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
        {departments.map((dept) =>
          view === 'grid' ? (
            <Card key={dept.id} padding="none" hover className="overflow-hidden flex flex-col">
              <div className={`relative h-28 bg-gradient-to-br ${dept.color} flex items-center justify-center`}>
                <Building2 size={40} className="text-white/90" />
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <IconButton title="Sửa" tone="light" onClick={() => openEdit(dept)}>
                    <Pencil size={14} />
                  </IconButton>
                  <IconButton title="Xóa" tone="light-danger" onClick={() => deleteDepartment(dept.id)}>
                    <Trash2 size={14} />
                  </IconButton>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-gray-400 mb-1">Mã: {dept.id}</p>
                <h3 className="font-bold text-gray-800 dark:text-slate-100" style={{ fontFamily: 'Lexend' }}>
                  {dept.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-2 flex-1">
                  {dept.description}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-slate-700">
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-300">
                    <UserRound size={15} className="text-[#1a56db]" />
                    {String(dept.doctorCount).padStart(2, '0')} Bác sĩ
                  </span>
                  <button
                    type="button"
                    onClick={() => openEdit(dept)}
                    className="text-sm font-medium text-[#1a56db] hover:underline"
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <Card key={dept.id} padding="sm" hover>
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center`}>
                  <Building2 size={22} className="text-white/90" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800 dark:text-slate-100 truncate">{dept.name}</h3>
                    <span className="text-xs text-gray-400">• {dept.id}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{dept.description}</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-300">
                  <UserRound size={15} className="text-[#1a56db]" />
                  {String(dept.doctorCount).padStart(2, '0')} Bác sĩ
                </span>
                <div className="flex items-center gap-1">
                  <IconButton title="Sửa" onClick={() => openEdit(dept)}>
                    <Pencil size={15} />
                  </IconButton>
                  <IconButton title="Xóa" tone="danger" onClick={() => deleteDepartment(dept.id)}>
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              </div>
            </Card>
          ),
        )}

        {view === 'grid' && (
          <button
            type="button"
            onClick={openCreate}
            className="min-h-[240px] rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#1a56db]/50 hover:text-[#1a56db] transition-colors"
          >
            <div className="p-3 rounded-xl bg-gray-100 dark:bg-slate-800">
              <Plus size={22} />
            </div>
            <p className="text-sm font-medium">Thêm khoa khám mới</p>
            <p className="text-xs text-gray-400">Tạo mới hồ sơ quản lý khoa trong hệ thống</p>
          </button>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Chỉnh sửa khoa khám' : 'Thêm khoa khám mới'}
        description={editing ? `Mã khoa: ${editing.id}` : 'Tạo mới hồ sơ quản lý khoa trong hệ thống'}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" form="department-form" leftIcon={<Plus size={16} />}>
              {editing ? 'Lưu thay đổi' : 'Tạo khoa'}
            </Button>
          </>
        }
      >
        <form id="department-form" onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-50 text-sm text-red-600">{error}</div>}
          <Input
            label="Tên khoa"
            required
            placeholder="VD: Khoa Tim mạch"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Mô tả</label>
            <textarea
              rows={3}
              placeholder="Mô tả chức năng và phạm vi điều trị của khoa"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border-gray-200 dark:border-slate-600 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10 resize-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Số bác sĩ"
              type="number"
              min={0}
              value={form.doctorCount}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, doctorCount: Number(event.target.value) || 0 }))
              }
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Màu nhãn</label>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {COLOR_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    title={option.label}
                    onClick={() => setForm((prev) => ({ ...prev, color: option.value }))}
                    className={`h-8 w-8 rounded-lg bg-gradient-to-br ${option.value} transition-transform ${
                      form.color === option.value
                        ? 'ring-2 ring-offset-2 ring-[#1a56db] scale-105'
                        : 'hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

interface IconButtonProps {
  children: React.ReactNode;
  title: string;
  tone?: 'default' | 'danger' | 'light' | 'light-danger';
  onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ children, title, tone = 'default', onClick }) => {
  const tones: Record<NonNullable<IconButtonProps['tone']>, string> = {
    default: 'text-gray-500 hover:bg-blue-50 hover:text-[#1a56db]',
    danger: 'text-gray-500 hover:bg-red-50 hover:text-red-500',
    light: 'bg-white/85 text-gray-600 hover:bg-white',
    'light-danger': 'bg-white/85 text-red-500 hover:bg-white',
  };
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-colors ${tones[tone]}`}
    >
      {children}
    </button>
  );
};

export default AdminDepartmentsPage;
