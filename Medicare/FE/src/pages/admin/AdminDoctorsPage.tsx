import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Pencil,
  Plus,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { Avatar, Badge, Card, Modal } from '../../components/ui';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { AdminDoctorInput, useAdminDoctors } from '../../features/admin/hooks';
import { DOCTOR_STATUS_LABELS } from '../../features/admin/constants';
import { AdminDoctor, AdminSectionStat, DoctorStatus } from '../../features/admin/types';

const PAGE_SIZE = 6;

const selectClass =
  'px-3 py-2 text-sm border rounded-lg outline-none bg-white text-gray-700 border-gray-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10 transition-all';

const formSelectClass =
  'w-full px-4 py-2.5 text-sm border rounded-xl outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border-gray-200 dark:border-slate-600 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10';

const formatDoctorCode = (id: string): string => {
  const clean = (id || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const suffix = clean.slice(-6) || '000001';
  return `BS-${suffix}`;
};

const EMPTY_DOCTOR: AdminDoctorInput = {
  fullName: '',
  email: '',
  phone: '',
  hasAccount: true,
  specialty: '',
  userId: undefined,
  experienceYears: 0,
  status: 'working',
};

const NOTE_TONE: Record<NonNullable<AdminSectionStat['noteTone']>, string> = {
  up: 'text-emerald-600',
  muted: 'text-gray-400',
  danger: 'text-red-500',
};

export const SectionStatCard: React.FC<{ stat: AdminSectionStat }> = ({ stat }) => {
  const { label, value, note, noteTone, icon: Icon, color } = stat;
  return (
    <Card padding="sm">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={18} />
        </div>
        {note && (
          <span className={`text-xs font-semibold ${noteTone ? NOTE_TONE[noteTone] : 'text-gray-400'}`}>
            {note}
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-0.5">{value}</p>
    </Card>
  );
};

export const AdminDoctorsPage: React.FC = () => {
  const {
    doctors,
    allDoctors,
    stats,
    specialties,
    total,
    specialty,
    setSpecialty,
    statusFilter,
    setStatusFilter,
    deleteDoctor,
    addDoctor,
    updateDoctor,
    assignSpecialty,
  } = useAdminDoctors();
  const [page, setPage] = useState(1);

  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminDoctor | null>(null);
  const [doctorForm, setDoctorForm] = useState<AdminDoctorInput>(EMPTY_DOCTOR);
  const [doctorError, setDoctorError] = useState('');

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignDoctorId, setAssignDoctorId] = useState('');
  const [assignSpecialtyValue, setAssignSpecialtyValue] = useState('');

  const totalPages = Math.max(1, Math.ceil(doctors.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = useMemo(
    () => doctors.slice(start, start + PAGE_SIZE),
    [doctors, start],
  );

  const openCreateDoctor = () => {
    setEditing(null);
    setDoctorForm({ ...EMPTY_DOCTOR, specialty: specialties[0] ?? '' });
    setDoctorError('');
    setDoctorModalOpen(true);
  };

  const openEditDoctor = (doctor: AdminDoctor) => {
    setEditing(doctor);
    setDoctorForm({
      fullName: doctor.fullName,
      email: doctor.email,
      phone: doctor.phone,
      hasAccount: doctor.hasAccount,
      specialty: doctor.specialty,
      userId: doctor.userId,
      experienceYears: doctor.experienceYears,
      status: doctor.status,
    });
    setDoctorError('');
    setDoctorModalOpen(true);
  };

  const handleDoctorSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!doctorForm.fullName.trim()) {
      setDoctorError('Vui lòng nhập họ tên bác sĩ.');
      return;
    }
    if (!doctorForm.specialty.trim()) {
      setDoctorError('Vui lòng chọn chuyên khoa.');
      return;
    }
    if (!editing && !doctorForm.email.trim()) {
      setDoctorError('Vui lòng nhập email để tạo tài khoản bác sĩ.');
      return;
    }
    if (editing) {
      updateDoctor(editing.id, doctorForm);
    } else {
      addDoctor(doctorForm);
    }
    setDoctorModalOpen(false);
  };

  const openAssign = () => {
    setAssignDoctorId(allDoctors[0]?.id ?? '');
    setAssignSpecialtyValue(specialties[0] ?? '');
    setAssignOpen(true);
  };

  const handleAssignSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!assignDoctorId || !assignSpecialtyValue) return;
    assignSpecialty(assignDoctorId, assignSpecialtyValue);
    setAssignOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>
            Danh sách Bác sĩ
          </h1>
          <p className="text-gray-500 dark:text-slate-400">
            Quản lý thông tin và phân công bác sĩ trong hệ thống.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" leftIcon={<ClipboardList size={16} />} onClick={openAssign}>
            Phân công khoa
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={openCreateDoctor}>
            Thêm bác sĩ
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <SectionStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100 dark:border-slate-700">
          <select
            value={specialty}
            onChange={(event) => {
              setSpecialty(event.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="all">Tất cả chuyên khoa</option>
            {specialties.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as typeof statusFilter);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="all">Trạng thái</option>
            <option value="working">{DOCTOR_STATUS_LABELS.working}</option>
            <option value="on_leave">{DOCTOR_STATUS_LABELS.on_leave}</option>
          </select>
          <button
            type="button"
            className="ml-auto p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            title="Bộ lọc"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-slate-400 border-b border-gray-100 dark:border-slate-700">
                <th className="px-5 py-3 font-medium">Bác sĩ</th>
                <th className="px-5 py-3 font-medium">Chuyên khoa</th>
                <th className="px-5 py-3 font-medium">Trạng thái</th>
                <th className="px-5 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {pageItems.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-700/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={doctor.fullName} size="md" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-slate-100 truncate">
                          {doctor.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {doctor.email || 'Chưa liên kết tài khoản'}
                        </p>
                        <p className="text-xs text-gray-400">Mã bác sĩ: {formatDoctorCode(doctor.id)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="gray" size="md">
                      {doctor.specialty}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-2 text-sm">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          doctor.status === 'working' ? 'bg-emerald-500' : 'bg-gray-400'
                        }`}
                      />
                      <span className="text-gray-600 dark:text-slate-300">
                        {DOCTOR_STATUS_LABELS[doctor.status]}
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Sửa"
                        onClick={() => openEditDoctor(doctor)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-[#1a56db] transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDoctor(doctor.id)}
                        title="Xóa"
                        className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
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
              Không có bác sĩ phù hợp bộ lọc.
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-gray-100 dark:border-slate-700">
          <p className="text-sm text-gray-500">
            Hiển thị {doctors.length === 0 ? 0 : start + 1}-{start + pageItems.length} trên {total} bác sĩ
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={(value) => setPage(value)}
          />
        </div>
      </Card>

      <Modal
        open={doctorModalOpen}
        onClose={() => setDoctorModalOpen(false)}
        title={editing ? 'Chỉnh sửa bác sĩ' : 'Thêm bác sĩ mới'}
        description={editing ? `Mã bác sĩ: ${formatDoctorCode(editing.id)}` : 'Tạo hồ sơ bác sĩ trong hệ thống'}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setDoctorModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" form="doctor-form" leftIcon={<Plus size={16} />}>
              {editing ? 'Lưu thay đổi' : 'Tạo bác sĩ'}
            </Button>
          </>
        }
      >
        <form id="doctor-form" onSubmit={handleDoctorSubmit} className="space-y-4">
          {doctorError && (
            <div className="p-3 rounded-xl bg-red-50 text-sm text-red-600">{doctorError}</div>
          )}
          <Input
            label="Họ và tên"
            required
            placeholder="VD: TS.BS. Nguyễn Văn A"
            value={doctorForm.fullName}
            onChange={(event) =>
              setDoctorForm((prev) => ({ ...prev, fullName: event.target.value }))
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Email tài khoản"
              type="email"
              required={!editing}
              placeholder="doctor@medicare.vn"
              value={doctorForm.email}
              onChange={(event) =>
                setDoctorForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
            <Input
              label="Số điện thoại"
              placeholder="09xxxxxxxx"
              value={doctorForm.phone}
              onChange={(event) =>
                setDoctorForm((prev) => ({ ...prev, phone: event.target.value }))
              }
            />
          </div>
          {!editing && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Tạo mới sẽ sinh tài khoản đăng nhập bác sĩ với mật khẩu mặc định `Medicare@123`.
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Chuyên khoa <span className="text-red-500">*</span>
            </label>
            <select
              value={doctorForm.specialty}
              onChange={(event) =>
                setDoctorForm((prev) => ({ ...prev, specialty: event.target.value }))
              }
              className={formSelectClass}
            >
              <option value="" disabled>
                Chọn chuyên khoa
              </option>
              {specialties.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Trạng thái</label>
            <select
              value={doctorForm.status}
              onChange={(event) =>
                setDoctorForm((prev) => ({ ...prev, status: event.target.value as DoctorStatus }))
              }
              className={formSelectClass}
            >
              <option value="working">{DOCTOR_STATUS_LABELS.working}</option>
              <option value="on_leave">{DOCTOR_STATUS_LABELS.on_leave}</option>
            </select>
          </div>
        </form>
      </Modal>

      <Modal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title="Phân công khoa"
        description="Chuyển bác sĩ sang chuyên khoa khác"
        size="sm"
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setAssignOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" form="assign-form" leftIcon={<ClipboardList size={16} />}>
              Phân công
            </Button>
          </>
        }
      >
        <form id="assign-form" onSubmit={handleAssignSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Bác sĩ</label>
            <select
              value={assignDoctorId}
              onChange={(event) => setAssignDoctorId(event.target.value)}
              className={formSelectClass}
            >
              {allDoctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.fullName} — {doctor.specialty}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Chuyên khoa mới
            </label>
            <select
              value={assignSpecialtyValue}
              onChange={(event) => setAssignSpecialtyValue(event.target.value)}
              className={formSelectClass}
            >
              {specialties.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onChange }) => (
  <div className="flex items-center gap-1">
    <button
      type="button"
      disabled={currentPage <= 1}
      onClick={() => onChange(currentPage - 1)}
      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
    >
      <ChevronLeft size={16} />
    </button>
    {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
      <button
        key={value}
        type="button"
        onClick={() => onChange(value)}
        className={`min-w-[34px] h-[34px] rounded-lg text-sm font-medium transition-colors ${
          value === currentPage
            ? 'bg-[#1a56db] text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        {value}
      </button>
    ))}
    <button
      type="button"
      disabled={currentPage >= totalPages}
      onClick={() => onChange(currentPage + 1)}
      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
    >
      <ChevronRight size={16} />
    </button>
  </div>
);

export default AdminDoctorsPage;
