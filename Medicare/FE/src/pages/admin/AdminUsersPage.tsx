import React, { useState } from 'react';
import { Ban, CheckCircle2, Search, Trash2, UserPlus } from 'lucide-react';
import { Avatar, Badge, Card, Modal } from '../../components/ui';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
  AdminUserInput,
  AdminUserRoleFilter,
  AdminUserStatusFilter,
  useAdminUsers,
} from '../../features/admin/hooks';
import { ROLE_LABELS, STATUS_LABELS } from '../../features/admin/constants';
import { AdminUserRole, AdminUserStatus } from '../../features/admin/types';

const formInputClass =
  'w-full px-4 py-2.5 text-sm border rounded-xl outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border-gray-200 dark:border-slate-600 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10';

const EMPTY_USER: AdminUserInput = {
  fullName: '',
  email: '',
  phone: '',
  role: 'patient',
  status: 'active',
};

const ROLE_FILTERS: { value: AdminUserRoleFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'patient', label: ROLE_LABELS.patient },
  { value: 'doctor', label: ROLE_LABELS.doctor },
  { value: 'receptionist', label: ROLE_LABELS.receptionist },
  { value: 'admin', label: ROLE_LABELS.admin },
];

const STATUS_FILTERS: { value: AdminUserStatusFilter; label: string }[] = [
  { value: 'all', label: 'Mọi trạng thái' },
  { value: 'active', label: STATUS_LABELS.active },
  { value: 'inactive', label: STATUS_LABELS.inactive },
  { value: 'suspended', label: STATUS_LABELS.suspended },
];

const ROLE_BADGE: Record<AdminUserRole, 'primary' | 'success' | 'warning' | 'gray'> = {
  admin: 'primary',
  doctor: 'success',
  receptionist: 'warning',
  patient: 'gray',
};

const STATUS_BADGE: Record<AdminUserStatus, 'success' | 'gray' | 'danger'> = {
  active: 'success',
  inactive: 'gray',
  suspended: 'danger',
};

const formatDate = (iso: string): string => new Date(iso).toLocaleDateString('vi-VN');

export const AdminUsersPage: React.FC = () => {
  const {
    users,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    setUserStatus,
    deleteUser,
    addUser,
    counts,
  } = useAdminUsers();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<AdminUserInput>(EMPTY_USER);
  const [error, setError] = useState('');

  const openCreate = () => {
    setForm(EMPTY_USER);
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.fullName.trim()) {
      setError('Vui lòng nhập họ tên.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Email không hợp lệ.');
      return;
    }
    addUser(form);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>
            Quản lý người dùng
          </h1>
          <p className="text-gray-500 dark:text-slate-400">
            Thêm, sửa, phân quyền tài khoản trong hệ thống.
          </p>
        </div>
        <Button leftIcon={<UserPlus size={16} />} onClick={openCreate}>
          Thêm người dùng
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryStat label="Tổng tài khoản" value={counts.total} />
        <SummaryStat label="Đang hoạt động" value={counts.active} accent="text-emerald-600" />
        <SummaryStat label="Bác sĩ" value={counts.doctors} accent="text-violet-600" />
        <SummaryStat label="Đã khóa" value={counts.suspended} accent="text-red-500" />
      </div>

      <Card padding="sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="lg:w-72">
            <Input
              placeholder="Tìm theo tên, email, số điện thoại"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {ROLE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setRoleFilter(filter.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  roleFilter === filter.value
                    ? 'bg-[#1a56db] text-white'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-[#1a56db]/40'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === filter.value
                  ? 'bg-slate-800 text-white'
                  : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-slate-400'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-700 text-left text-gray-500 dark:text-slate-400">
                <th className="px-5 py-3 font-medium">Người dùng</th>
                <th className="px-5 py-3 font-medium">Vai trò</th>
                <th className="px-5 py-3 font-medium">Trạng thái</th>
                <th className="px-5 py-3 font-medium hidden md:table-cell">Ngày tạo</th>
                <th className="px-5 py-3 font-medium hidden lg:table-cell">Hoạt động gần nhất</th>
                <th className="px-5 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-700/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar} name={user.fullName} size="sm" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 dark:text-slate-100 truncate">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={ROLE_BADGE[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={STATUS_BADGE[user.status]}>{STATUS_LABELS[user.status]}</Badge>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-gray-500 dark:text-slate-400">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-gray-500 dark:text-slate-400">
                    {formatDate(user.lastActiveAt)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {user.status === 'suspended' ? (
                        <button
                          type="button"
                          onClick={() => setUserStatus(user.id, 'active')}
                          title="Mở khóa"
                          className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setUserStatus(user.id, 'suspended')}
                          title="Khóa tài khoản"
                          className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <Ban size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteUser(user.id)}
                        title="Xóa"
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-500 dark:text-slate-400">
              Không tìm thấy người dùng phù hợp.
            </div>
          )}
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Thêm người dùng mới"
        description="Tạo tài khoản và phân quyền trong hệ thống"
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" form="user-form" leftIcon={<UserPlus size={16} />}>
              Tạo tài khoản
            </Button>
          </>
        }
      >
        <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-50 text-sm text-red-600">{error}</div>}
          <Input
            label="Họ và tên"
            required
            placeholder="VD: Nguyễn Văn A"
            value={form.fullName}
            onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Email"
              type="email"
              required
              placeholder="email@medicare.vn"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
            <Input
              label="Số điện thoại"
              placeholder="09xxxxxxxx"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Vai trò</label>
              <select
                value={form.role}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, role: event.target.value as AdminUserRole }))
                }
                className={formInputClass}
              >
                <option value="patient">{ROLE_LABELS.patient}</option>
                <option value="doctor">{ROLE_LABELS.doctor}</option>
                <option value="receptionist">{ROLE_LABELS.receptionist}</option>
                <option value="admin">{ROLE_LABELS.admin}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Trạng thái</label>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, status: event.target.value as AdminUserStatus }))
                }
                className={formInputClass}
              >
                <option value="active">{STATUS_LABELS.active}</option>
                <option value="inactive">{STATUS_LABELS.inactive}</option>
                <option value="suspended">{STATUS_LABELS.suspended}</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const SummaryStat: React.FC<{ label: string; value: number; accent?: string }> = ({
  label,
  value,
  accent = 'text-gray-800 dark:text-slate-100',
}) => (
  <Card padding="sm">
    <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
  </Card>
);

export default AdminUsersPage;
