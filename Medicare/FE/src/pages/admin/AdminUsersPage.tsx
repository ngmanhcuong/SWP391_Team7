import React, { useState } from 'react';
import { Ban, CheckCircle2, Pencil, Search, Trash2, UserPlus } from 'lucide-react';
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
  { value: 'admin', label: ROLE_LABELS.admin },
  { value: 'doctor', label: ROLE_LABELS.doctor },
  { value: 'patient', label: ROLE_LABELS.patient },
  { value: 'receptionist', label: ROLE_LABELS.receptionist },
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
    syncAllAccounts,
    setUserStatus,
    updateUserRole,
    deleteUser,
    addUser,
    counts,
  } = useAdminUsers();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<AdminUserInput>(EMPTY_USER);
  const [error, setError] = useState('');
  const [roleModal, setRoleModal] = useState<{ id: string; name: string; role: AdminUserRole } | null>(null);

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
    if (form.role === 'doctor') {
      setError('Không thể tạo tài khoản bác sĩ tại màn hình quản lý người dùng.');
      return;
    }
    addUser(form);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-bold" style={{ fontFamily: 'Lexend' }}>
            Quản lý người dùng
          </h1>
          <p className="text-gray-500 dark:text-slate-400">
            Dữ liệu được đồng bộ theo tài khoản thật đang có trong hệ thống.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => syncAllAccounts()}>
            Đồng bộ database
          </Button>
          <Button leftIcon={<UserPlus size={16} />} onClick={openCreate}>
            Thêm người dùng
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryStat label="Tổng tài khoản" value={counts.total} />
        <SummaryStat label="Đang hoạt động" value={counts.active} accent="text-emerald-600" />
        <SummaryStat label="Lễ tân" value={counts.receptionists} accent="text-amber-600" />
        <SummaryStat label="Đã khóa" value={counts.suspended} accent="text-red-500" />
      </div>

      <Card padding="sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="lg:w-80">
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
                    : 'border border-gray-200 bg-gray-50 text-gray-600 hover:border-[#1a56db]/40'
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
                  : 'border border-gray-200 bg-gray-50 text-gray-500 hover:border-slate-400'
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
              <tr className="border-b border-gray-100 text-left text-gray-500 dark:border-slate-700 dark:text-slate-400">
                <th className="px-5 py-3 font-medium">Người dùng</th>
                <th className="px-5 py-3 font-medium">Vai trò</th>
                <th className="px-5 py-3 font-medium">Trạng thái</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Ngày tạo</th>
                <th className="hidden px-5 py-3 font-medium lg:table-cell">Hoạt động gần nhất</th>
                <th className="px-5 py-3 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {users.map((user) => {
                const isAdmin = user.role === 'admin';
                return (
                  <tr key={user.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-700/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} name={user.fullName} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-800 dark:text-slate-100">
                            {user.fullName}
                          </p>
                          <p className="truncate text-xs text-gray-500 dark:text-slate-400">
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
                    <td className="hidden px-5 py-3 text-gray-500 dark:text-slate-400 md:table-cell">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="hidden px-5 py-3 text-gray-500 dark:text-slate-400 lg:table-cell">
                      {formatDate(user.lastActiveAt)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (!isAdmin) {
                              setRoleModal({ id: user.id, name: user.fullName, role: user.role });
                            }
                          }}
                          title={isAdmin ? 'Tài khoản admin không đổi vai trò tại đây' : 'Chỉnh sửa vai trò'}
                          disabled={isAdmin}
                          className={`rounded-lg p-2 transition-colors ${
                            isAdmin
                              ? 'cursor-not-allowed text-gray-300'
                              : 'text-[#1a56db] hover:bg-blue-50'
                          }`}
                        >
                          <Pencil size={16} />
                        </button>

                        {user.status === 'suspended' ? (
                          <button
                            type="button"
                            onClick={() => setUserStatus(user.id, 'active')}
                            title="Mở khóa"
                            className="rounded-lg p-2 text-emerald-600 transition-colors hover:bg-emerald-50"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setUserStatus(user.id, 'suspended')}
                            title="Khóa tài khoản"
                            className="rounded-lg p-2 text-amber-600 transition-colors hover:bg-amber-50"
                          >
                            <Ban size={16} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteUser(user.id)}
                          title="Xóa"
                          className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
        open={!!roleModal}
        onClose={() => setRoleModal(null)}
        title="Chỉnh sửa vai trò"
        description={roleModal ? `Thay đổi vai trò cho ${roleModal.name}` : ''}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setRoleModal(null)}>
              Hủy
            </Button>
            <Button
              type="button"
              leftIcon={<Pencil size={16} />}
              onClick={() => {
                if (roleModal) {
                  updateUserRole(roleModal.id, roleModal.role);
                  setRoleModal(null);
                }
              }}
            >
              Lưu vai trò
            </Button>
          </>
        }
      >
        {roleModal && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Vai trò</label>
            <select
              value={roleModal.role}
              onChange={(event) =>
                setRoleModal((prev) => (
                  prev ? { ...prev, role: event.target.value as AdminUserRole } : prev
                ))
              }
              className={formInputClass}
            >
              <option value="patient">{ROLE_LABELS.patient}</option>
              <option value="doctor">{ROLE_LABELS.doctor}</option>
              <option value="receptionist">{ROLE_LABELS.receptionist}</option>
            </select>
          </div>
        )}
      </Modal>

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
          {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>}

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
              placeholder="email@medicare.com"
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
                <option value="receptionist">{ROLE_LABELS.receptionist}</option>
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
    <p className={`mt-1 text-2xl font-bold ${accent}`}>{value}</p>
    </Card>
);

export default AdminUsersPage;
