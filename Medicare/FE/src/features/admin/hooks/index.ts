import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ADMIN_APPOINTMENT_STATS,
  ADMIN_AUDIT_LOGS,
  ADMIN_AUDIT_SUMMARY,
  ADMIN_AUDIT_TOTAL,
  ADMIN_DASHBOARD_STATS,
  ADMIN_DEPARTMENT_STATS,
  ADMIN_DOCTOR_STATS,
  ADMIN_PATIENT_TREND,
  ADMIN_QUARTERLY_GOAL,
  ADMIN_REPORT_STATS,
  ADMIN_REVIEW_STATS,
  ADMIN_ROOMS,
  ADMIN_ROOM_STATS,
  ADMIN_SPECIALTY_SHARE,
  ADMIN_SPECIALTY_TOTAL,
  ADMIN_SUPPLIES,
  ADMIN_SUPPLIES_TOTAL,
  ADMIN_SYSTEM_NOTICES,
  ADMIN_TOTAL_ROOMS,
  DEFAULT_ADMIN_PROFILE,
  DEFAULT_ADMIN_SETTINGS,
} from '../constants';
import {
  AdminAppointment,
  AuditLogEntry,
  AdminDashboardStat,
  AdminDepartment,
  AdminDoctor,
  AdminProfileForm,
  AdminReview,
  AdminRoom,
  AdminSectionStat,
  AdminSettingsForm,
  AdminUser,
  AdminUserRole,
  AdminUserStatus,
  AppointmentStatus,
  AppointmentTrendPoint,
  AuditActionType,
  DoctorStatus,
  NewAppointment,
  ReviewStatus,
  RoomStatus,
  TopDepartment,
} from '../types';
import {
  adminApi,
  AdminAppointmentsResponse,
  AdminAuditLogsResponse,
  AdminDashboardResponse,
  AdminReportsResponse,
  AdminReviewsResponse,
} from '../services/adminApi';

export type AdminUserRoleFilter = AdminUserRole | 'all';
export type AdminUserStatusFilter = AdminUserStatus | 'all';
export type AdminUserInput = Omit<AdminUser, 'id' | 'createdAt' | 'lastActiveAt'>;

const matches = (query: string, ...values: string[]): boolean => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return values.some((value) => value.toLowerCase().includes(normalized));
};

// Ghi đè value (và note) của khung thẻ thống kê tĩnh bằng số liệu thật.
const overrideStat = (
  stat: AdminSectionStat,
  value: number | string,
  note?: string,
): AdminSectionStat => ({
  ...stat,
  value: typeof value === 'number' ? value.toLocaleString('vi-VN') : value,
  ...(note !== undefined ? { note } : {}),
});

// ─── Dashboard ───────────────────────────────────────────
export const useAdminDashboard = () => {
  const { data } = useQuery<AdminDashboardResponse>({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminApi.getDashboard(),
  });

  const stats: AdminDashboardStat[] = useMemo(() => {
    const s = data?.stats;
    return ADMIN_DASHBOARD_STATS.map((stat) => {
      if (!s) return { ...stat, value: '…' };
      switch (stat.id) {
        case 'total-patients':
          return { ...stat, value: s.patients.toLocaleString('vi-VN') };
        case 'total-doctors':
          return { ...stat, value: s.doctors.toLocaleString('vi-VN') };
        case 'total-appointments':
          return { ...stat, value: s.appointments.toLocaleString('vi-VN') };
        case 'total-departments':
          return { ...stat, value: s.specialties.toLocaleString('vi-VN') };
        case 'total-rooms':
          return { ...stat, value: s.rooms.toLocaleString('vi-VN') };
        case 'revenue':
          return { ...stat, value: s.revenueLabel };
        default:
          return stat;
      }
    });
  }, [data]);

  const appointmentTrend: AppointmentTrendPoint[] = data?.monthlyTrend ?? [];
  const newAppointments: NewAppointment[] = data?.newAppointments ?? [];
  const topDepartments: TopDepartment[] = data?.topDepartments ?? [];

  return {
    stats,
    appointmentTrend,
    newAppointments,
    systemNotices: ADMIN_SYSTEM_NOTICES,
    topDepartments,
    quarterlyGoal: ADMIN_QUARTERLY_GOAL,
    newUsersToday: data?.newUsersToday ?? 0,
  };
};

export const useAdminReports = () => {
  const { data } = useQuery<AdminReportsResponse>({
    queryKey: ['admin', 'reports'],
    queryFn: () => adminApi.getReports(),
  });

  const stats = useMemo(() => {
    const summary = data?.stats;
    return ADMIN_REPORT_STATS.map((stat) => {
      if (stat.id === 'new-patients') {
        return {
          ...stat,
          value: (summary?.patients ?? 0).toLocaleString('vi-VN'),
          delta: 'Theo dữ liệu hiện tại',
          trend: 'up' as const,
          progress: Math.min(100, Math.max(0, (summary?.patients ?? 0) * 5)),
        };
      }
      if (stat.id === 'revenue') {
        return {
          ...stat,
          value: `${(summary?.revenue ?? 0).toLocaleString('vi-VN')} VND`,
          delta: 'Theo hóa đơn đã thanh toán',
          trend: 'up' as const,
          progress: summary?.revenue ? 100 : 0,
        };
      }
      if (stat.id === 'supplies-used') {
        return {
          ...stat,
          value: (summary?.suppliesUsed ?? 0).toLocaleString('vi-VN'),
          delta: 'Chưa có dữ liệu kho thực tế',
          trend: 'down' as const,
          progress: 0,
        };
      }
      if (stat.id === 'completion-rate') {
        return {
          ...stat,
          value: `${(summary?.completionRate ?? 0).toLocaleString('vi-VN')}%`,
          delta: 'Tỷ lệ lịch hoàn thành',
          trend: 'up' as const,
          progress: summary?.completionRate ?? 0,
        };
      }
      return stat;
    });
  }, [data]);

  return {
    stats,
    patientTrend: data?.patientTrend ?? ADMIN_PATIENT_TREND.map((item) => ({ ...item, value: 0 })),
    specialtyShare: data?.specialtyShare ?? ADMIN_SPECIALTY_SHARE,
    specialtyTotal: (data?.specialtyTotal ?? 0).toLocaleString('vi-VN'),
    supplies: data?.supplies ?? [],
    suppliesTotal: data?.suppliesTotal ?? 0,
    generatedAt: data?.generatedAt,
  };
};

// ─── Users ───────────────────────────────────────────────
export const useAdminUsers = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery<AdminUser[]>({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getUsers(),
  });
  const users = useMemo<AdminUser[]>(() => data ?? [], [data]);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<AdminUserRoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<AdminUserStatusFilter>('all');

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
  const syncMutation = useMutation({
    mutationFn: adminApi.syncAllAccounts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
    },
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AdminUserStatus }) =>
      adminApi.updateUserStatus(id, status),
    onSuccess: invalidate,
  });
  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      adminApi.updateUserRole(id, role),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: adminApi.deleteUser, onSuccess: invalidate });
  const addMutation = useMutation({ mutationFn: adminApi.createUser, onSuccess: invalidate });

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return (
          matchesRole &&
          matchesStatus &&
          matches(search, user.fullName, user.email, user.phone)
        );
      }),
    [users, search, roleFilter, statusFilter],
  );

  const setUserStatus = (id: string, status: AdminUserStatus) => statusMutation.mutate({ id, status });
  const updateUserRole = (id: string, role: string) => roleMutation.mutate({ id, role });
  const deleteUser = (id: string) => deleteMutation.mutate(id);
  const addUser = (input: AdminUserInput) => addMutation.mutate(input);
  const syncAllAccounts = () => syncMutation.mutate();

  const counts = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.status === 'active').length,
      suspended: users.filter((user) => user.status === 'suspended').length,
      admins: users.filter((user) => user.role === 'admin').length,
      doctors: users.filter((user) => user.role === 'doctor').length,
      receptionists: users.filter((user) => user.role === 'receptionist').length,
      patients: users.filter((user) => user.role === 'patient').length,
    }),
    [users],
  );

  return {
    users: filteredUsers,
    totalUsers: users.length,
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
  };
};

// ─── Doctors ─────────────────────────────────────────────
export type DoctorStatusFilter = DoctorStatus | 'all';
export type AdminDoctorInput = Omit<AdminDoctor, 'id'>;

export const useAdminDoctors = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery<AdminDoctor[]>({
    queryKey: ['admin', 'doctors'],
    queryFn: () => adminApi.getDoctors(),
  });
  const doctors = useMemo<AdminDoctor[]>(() => data ?? [], [data]);

  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<DoctorStatusFilter>('all');

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
  const syncMutation = useMutation({
    mutationFn: adminApi.syncDoctorAccounts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
  const addMutation = useMutation({ mutationFn: adminApi.createDoctor, onSuccess: invalidate });
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<AdminDoctorInput> }) =>
      adminApi.updateDoctor(id, input),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: adminApi.deleteDoctor, onSuccess: invalidate });

  const specialties = useMemo(
    () => Array.from(new Set(doctors.map((doctor) => doctor.specialty).filter(Boolean))),
    [doctors],
  );

  const filteredDoctors = useMemo(
    () =>
      doctors.filter((doctor) => {
        const matchesSpecialty = specialty === 'all' || doctor.specialty === specialty;
        const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter;
        return matchesSpecialty && matchesStatus && matches(search, doctor.fullName, doctor.id, doctor.specialty);
      }),
    [doctors, search, specialty, statusFilter],
  );

  const stats: AdminSectionStat[] = useMemo(() => {
    const working = doctors.filter((d) => d.status === 'working').length;
    const onLeave = doctors.filter((d) => d.status === 'on_leave').length;
    return [
      overrideStat(ADMIN_DOCTOR_STATS[0], doctors.length, 'toàn hệ thống'),
      overrideStat(ADMIN_DOCTOR_STATS[1], working, 'đang làm việc'),
      overrideStat(ADMIN_DOCTOR_STATS[2], specialties.length, `${specialties.length} khoa`),
      overrideStat(ADMIN_DOCTOR_STATS[3], onLeave, 'nghỉ phép'),
    ];
  }, [doctors, specialties]);

  const deleteDoctor = (id: string) => deleteMutation.mutate(id);
  const syncDoctorAccounts = () => syncMutation.mutate();
  const addDoctor = (input: AdminDoctorInput) => addMutation.mutate(input);
  const updateDoctor = (id: string, input: AdminDoctorInput) => updateMutation.mutate({ id, input });
  const assignSpecialty = (id: string, nextSpecialty: string) =>
    updateMutation.mutate({ id, input: { specialty: nextSpecialty } });

  return {
    doctors: filteredDoctors,
    allDoctors: doctors,
    stats,
    specialties,
    total: doctors.length,
    search,
    setSearch,
    specialty,
    setSpecialty,
    statusFilter,
    setStatusFilter,
    syncDoctorAccounts,
    deleteDoctor,
    addDoctor,
    updateDoctor,
    assignSpecialty,
  };
};

// ─── Rooms (mock - chưa có collection) ───────────────────
export type RoomStatusFilter = RoomStatus | 'all';
export type AdminRoomInput = Omit<AdminRoom, 'id'>;

const generateRoomId = (existing: AdminRoom[]): string => {
  const max = existing.reduce((acc, room) => {
    const match = room.id.match(/(\d+)$/);
    return Math.max(acc, match ? Number(match[1]) : 0);
  }, 100);
  return `P-${max + 1}`;
};

export const useAdminRooms = () => {
  const [rooms, setRooms] = useState<AdminRoom[]>(ADMIN_ROOMS);
  const [department, setDepartment] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<RoomStatusFilter>('all');

  const departments = useMemo(
    () => Array.from(new Set(rooms.map((room) => room.department))),
    [rooms],
  );

  const filteredRooms = useMemo(
    () =>
      rooms.filter((room) => {
        const matchesDept = department === 'all' || room.department === department;
        const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
        return matchesDept && matchesStatus;
      }),
    [rooms, department, statusFilter],
  );

  const deleteRoom = (id: string) =>
    setRooms((prev) => prev.filter((room) => room.id !== id));

  const addRoom = (data: AdminRoomInput) =>
    setRooms((prev) => [{ ...data, id: generateRoomId(prev) }, ...prev]);

  const updateRoom = (id: string, data: AdminRoomInput) =>
    setRooms((prev) => prev.map((room) => (room.id === id ? { ...room, ...data } : room)));

  return {
    rooms: filteredRooms,
    stats: ADMIN_ROOM_STATS,
    departments,
    total: ADMIN_TOTAL_ROOMS - ADMIN_ROOMS.length + rooms.length,
    department,
    setDepartment,
    statusFilter,
    setStatusFilter,
    deleteRoom,
    addRoom,
    updateRoom,
  };
};

// ─── Departments / Specialties ───────────────────────────
export type DepartmentSort = 'name-asc' | 'name-desc' | 'doctors-desc';
export type AdminDepartmentInput = Omit<AdminDepartment, 'id'>;

export const useAdminDepartments = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery<AdminDepartment[]>({
    queryKey: ['admin', 'specialties'],
    queryFn: () => adminApi.getSpecialties(),
  });
  const departments = useMemo<AdminDepartment[]>(() => data ?? [], [data]);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<DepartmentSort>('name-asc');

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'specialties'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
  };
  const addMutation = useMutation({ mutationFn: adminApi.createSpecialty, onSuccess: invalidate });
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: AdminDepartmentInput }) =>
      adminApi.updateSpecialty(id, input),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: adminApi.deleteSpecialty, onSuccess: invalidate });

  const visibleDepartments = useMemo(() => {
    const filtered = departments.filter((dept) =>
      matches(search, dept.name, dept.id, dept.description),
    );
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sort === 'name-desc') return b.name.localeCompare(a.name, 'vi');
      if (sort === 'doctors-desc') return b.doctorCount - a.doctorCount;
      return a.name.localeCompare(b.name, 'vi');
    });
    return sorted;
  }, [departments, search, sort]);

  const stats: AdminSectionStat[] = useMemo(() => {
    const totalDoctors = departments.reduce((acc, dept) => acc + dept.doctorCount, 0);
    return ADMIN_DEPARTMENT_STATS.map((stat) => {
      if (stat.id === 'total') return overrideStat(stat, departments.length);
      if (stat.id === 'doctors') return overrideStat(stat, totalDoctors);
      return stat;
    });
  }, [departments]);

  const deleteDepartment = (id: string) => deleteMutation.mutate(id);
  const addDepartment = (input: AdminDepartmentInput) => addMutation.mutate(input);
  const updateDepartment = (id: string, input: AdminDepartmentInput) =>
    updateMutation.mutate({ id, input });

  return {
    departments: visibleDepartments,
    stats,
    search,
    setSearch,
    sort,
    setSort,
    deleteDepartment,
    addDepartment,
    updateDepartment,
  };
};

// ─── Reviews (mock) ──────────────────────────────────────
export type ReviewRatingFilter = number | 'all';

export const useAdminReviews = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery<AdminReviewsResponse>({
    queryKey: ['admin', 'reviews'],
    queryFn: () => adminApi.getReviews(),
  });
  const reviews = useMemo<AdminReview[]>(() => data?.items ?? [], [data]);
  const [department, setDepartment] = useState<string>('all');
  const [rating, setRating] = useState<ReviewRatingFilter>('all');
  const [date, setDate] = useState('');

  const departments = useMemo(() => data?.departments ?? [], [data]);
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReviewStatus }) =>
      adminApi.updateReviewStatus(id, status),
    onSuccess: invalidate,
  });

  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) => {
        const matchesDept = department === 'all' || review.department === department;
        const matchesRating = rating === 'all' || review.rating === rating;
        const matchesDate = !date || review.date === new Date(date).toLocaleDateString('vi-VN');
        return matchesDept && matchesRating && matchesDate;
      }),
    [reviews, department, rating, date],
  );

  const setReviewStatus = (id: string, status: ReviewStatus) =>
    statusMutation.mutate({ id, status });

  const stats = useMemo(() => {
    const summary = data?.stats;
    return ADMIN_REVIEW_STATS.map((stat) => {
      if (stat.id === 'total') return overrideStat(stat, summary?.total ?? 0);
      if (stat.id === 'avg') return overrideStat(stat, summary?.averageRating ?? 0);
      if (stat.id === 'flagged') return overrideStat(stat, summary?.hiddenCount ?? 0);
      if (stat.id === 'month') return overrideStat(stat, summary?.monthlyDelta ?? '0%');
      return stat;
    });
  }, [data]);

  const resetFilters = () => {
    setDepartment('all');
    setRating('all');
    setDate('');
  };

  return {
    reviews: filteredReviews,
    stats,
    total: data?.total ?? reviews.length,
    departments,
    department,
    setDepartment,
    rating,
    setRating,
    date,
    setDate,
    setReviewStatus,
    refreshReviews: invalidate,
    resetFilters,
  };
};

// ─── Appointments ────────────────────────────────────────
export type AppointmentStatusFilter = AppointmentStatus | 'all';

export type AdminAppointmentInput = Omit<AdminAppointment, 'id' | 'patientInitials' | 'status'> & {
  status?: AppointmentStatus;
};

export const useAdminAppointments = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery<AdminAppointmentsResponse>({
    queryKey: ['admin', 'appointments'],
    queryFn: () => adminApi.getAppointments(),
  });
  const appointments = useMemo<AdminAppointment[]>(() => data?.items ?? [], [data]);

  const [statusFilter, setStatusFilter] = useState<AppointmentStatusFilter>('all');

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] });
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      adminApi.updateAppointmentStatus(id, status),
    onSuccess: invalidate,
  });
  const addMutation = useMutation({ mutationFn: adminApi.createAppointment, onSuccess: invalidate });

  const filtered = useMemo(
    () =>
      appointments.filter(
        (appointment) => statusFilter === 'all' || appointment.status === statusFilter,
      ),
    [appointments, statusFilter],
  );

  const stats: AdminSectionStat[] = useMemo(() => {
    const s = data?.stats;
    return ADMIN_APPOINTMENT_STATS.map((stat) => {
      if (!s) return { ...stat, value: '…' };
      if (stat.id === 'today') return overrideStat(stat, s.today);
      if (stat.id === 'pending') return overrideStat(stat, s.pending);
      if (stat.id === 'completed') return overrideStat(stat, s.completed);
      if (stat.id === 'cancelled') return overrideStat(stat, s.cancelled);
      return stat;
    });
  }, [data]);

  const setAppointmentStatus = (id: string, status: AppointmentStatus) =>
    statusMutation.mutate({ id, status });
  const addAppointment = (input: AdminAppointmentInput) => addMutation.mutate(input);

  return {
    appointments: filtered,
    stats,
    total: data?.total ?? appointments.length,
    statusFilter,
    setStatusFilter,
    setAppointmentStatus,
    addAppointment,
  };
};

// ─── Audit log (mock) ────────────────────────────────────
export type AuditActionFilter = AuditActionType | 'all';

export const useAdminAuditLog = () => {
  const { data, refetch } = useQuery<AdminAuditLogsResponse>({
    queryKey: ['admin', 'audit-logs'],
    queryFn: () => adminApi.getAuditLogs(),
  });
  const [actor, setActor] = useState<string>('all');
  const [actionType, setActionType] = useState<AuditActionFilter>('all');
  const [timeframe, setTimeframe] = useState<string>('today');

  const actors = useMemo(() => data?.actors ?? [], [data]);

  const summary = useMemo(() => {
    const raw = data?.summary;
    return ADMIN_AUDIT_SUMMARY.map((item) => {
      if (item.id === 'new-acc') {
        return { ...item, value: String(raw?.newAccounts ?? 0), note: 'Theo DB hiện tại' };
      }
      if (item.id === 'new-appt') {
        return { ...item, value: String(raw?.bookings ?? 0), note: 'Theo DB hiện tại' };
      }
      if (item.id === 'abnormal') {
        return { ...item, value: String((raw?.payments ?? 0) + (raw?.updates ?? 0)), note: 'Thanh toán / cập nhật' };
      }
      return item;
    });
  }, [data]);

  const logs = useMemo(
    () =>
      (data?.items ?? []).filter((log: AuditLogEntry) => {
        const matchesActor = actor === 'all' || log.actorName === actor;
        const matchesAction = actionType === 'all' || log.actionType === actionType;
        const timestamp = new Date(log.createdAt ?? 0);
        const now = new Date('2026-07-19T23:59:59+07:00');
        const todayStart = new Date('2026-07-19T00:00:00+07:00');
        const weekStart = new Date('2026-07-13T00:00:00+07:00');
        const monthStart = new Date('2026-07-01T00:00:00+07:00');
        const matchesTimeframe =
          timeframe === 'today'
            ? timestamp >= todayStart && timestamp <= now
            : timeframe === 'week'
              ? timestamp >= weekStart && timestamp <= now
              : timestamp >= monthStart && timestamp <= now;
        return matchesActor && matchesAction && matchesTimeframe;
      }),
    [data, actor, actionType, timeframe],
  );

  return {
    logs,
    summary,
    total: logs.length,
    actors,
    actor,
    setActor,
    actionType,
    setActionType,
    timeframe,
    setTimeframe,
    refreshAuditLogs: refetch,
  };
};

export const useAdminProfile = () => {
  const [profile, setProfile] = useState<AdminProfileForm>(DEFAULT_ADMIN_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const updateField = <K extends keyof AdminProfileForm>(field: K, value: AdminProfileForm[K]) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const resetProfile = () => setProfile(DEFAULT_ADMIN_PROFILE);

  const saveProfile = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSaving(false);
    setSavedAt(new Date());
  };

  return { profile, updateField, resetProfile, saveProfile, isSaving, savedAt };
};

export const useAdminSettings = () => {
  const [settings, setSettings] = useState<AdminSettingsForm>(DEFAULT_ADMIN_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const updateField = <K extends keyof AdminSettingsForm>(
    field: K,
    value: AdminSettingsForm[K],
  ) => setSettings((prev) => ({ ...prev, [field]: value }));

  const resetSettings = () => {
    setSettings(DEFAULT_ADMIN_SETTINGS);
    setSavedAt(null);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSaving(false);
    setSavedAt(new Date());
  };

  return { settings, updateField, resetSettings, saveSettings, isSaving, savedAt };
};
