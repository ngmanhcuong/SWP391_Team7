import { useMemo, useState } from 'react';
import {
  ADMIN_APPOINTMENTS,
  ADMIN_APPOINTMENT_STATS,
  ADMIN_APPOINTMENT_TOTAL,
  ADMIN_APPOINTMENT_TREND,
  ADMIN_AUDIT_LOGS,
  ADMIN_AUDIT_SUMMARY,
  ADMIN_AUDIT_TOTAL,
  ADMIN_DASHBOARD_STATS,
  ADMIN_DEPARTMENTS,
  ADMIN_DEPARTMENT_STATS,
  ADMIN_DOCTORS,
  ADMIN_DOCTOR_STATS,
  ADMIN_MONTHLY_SERIES,
  ADMIN_NEW_APPOINTMENTS,
  ADMIN_NEW_USERS_TODAY,
  ADMIN_PATIENT_TREND,
  ADMIN_QUARTERLY_GOAL,
  ADMIN_REPORT_METRICS,
  ADMIN_REPORT_STATS,
  ADMIN_REVIEWS,
  ADMIN_REVIEW_STATS,
  ADMIN_REVIEW_TOTAL,
  ADMIN_ROOMS,
  ADMIN_ROOM_STATS,
  ADMIN_SPECIALTY_SHARE,
  ADMIN_SPECIALTY_TOTAL,
  ADMIN_SUPPLIES,
  ADMIN_SUPPLIES_TOTAL,
  ADMIN_SYSTEM_NOTICES,
  ADMIN_TOP_DEPARTMENTS,
  ADMIN_TOP_SPECIALTIES,
  ADMIN_TOTAL_DOCTORS,
  ADMIN_TOTAL_ROOMS,
  ADMIN_USERS,
  DEFAULT_ADMIN_PROFILE,
  DEFAULT_ADMIN_SETTINGS,
} from '../constants';
import {
  AdminAppointment,
  AdminDepartment,
  AdminDoctor,
  AdminProfileForm,
  AdminReview,
  AdminRoom,
  AdminSettingsForm,
  AdminUser,
  AdminUserRole,
  AdminUserStatus,
  AppointmentStatus,
  AuditActionType,
  DoctorStatus,
  ReviewStatus,
  RoomStatus,
} from '../types';

export type AdminUserRoleFilter = AdminUserRole | 'all';
export type AdminUserStatusFilter = AdminUserStatus | 'all';
export type AdminUserInput = Omit<AdminUser, 'id' | 'createdAt' | 'lastActiveAt'>;

const matches = (query: string, ...values: string[]): boolean => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return values.some((value) => value.toLowerCase().includes(normalized));
};

export const useAdminDashboard = () => ({
  stats: ADMIN_DASHBOARD_STATS,
  appointmentTrend: ADMIN_APPOINTMENT_TREND,
  newAppointments: ADMIN_NEW_APPOINTMENTS,
  systemNotices: ADMIN_SYSTEM_NOTICES,
  topDepartments: ADMIN_TOP_DEPARTMENTS,
  quarterlyGoal: ADMIN_QUARTERLY_GOAL,
  newUsersToday: ADMIN_NEW_USERS_TODAY,
});

export const useAdminReports = () => ({
  metrics: ADMIN_REPORT_METRICS,
  monthlySeries: ADMIN_MONTHLY_SERIES,
  topSpecialties: ADMIN_TOP_SPECIALTIES,
  stats: ADMIN_REPORT_STATS,
  patientTrend: ADMIN_PATIENT_TREND,
  specialtyShare: ADMIN_SPECIALTY_SHARE,
  specialtyTotal: ADMIN_SPECIALTY_TOTAL,
  supplies: ADMIN_SUPPLIES,
  suppliesTotal: ADMIN_SUPPLIES_TOTAL,
});

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>(ADMIN_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<AdminUserRoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<AdminUserStatusFilter>('all');

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

  const setUserStatus = (id: string, status: AdminUserStatus) =>
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status } : user)));

  const deleteUser = (id: string) =>
    setUsers((prev) => prev.filter((user) => user.id !== id));

  const addUser = (data: AdminUserInput) =>
    setUsers((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      return [
        {
          ...data,
          id: `u-${1000 + prev.length + 1}`,
          createdAt: today,
          lastActiveAt: today,
        },
        ...prev,
      ];
    });

  const counts = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.status === 'active').length,
      suspended: users.filter((user) => user.status === 'suspended').length,
      doctors: users.filter((user) => user.role === 'doctor').length,
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
    setUserStatus,
    deleteUser,
    addUser,
    counts,
  };
};

export type DoctorStatusFilter = DoctorStatus | 'all';

export type AdminDoctorInput = Omit<AdminDoctor, 'id'>;

const generateDoctorId = (existing: AdminDoctor[]): string => {
  const max = existing.reduce((acc, doctor) => {
    const match = doctor.id.match(/(\d+)$/);
    const num = match ? Number(match[1]) : 0;
    return Math.max(acc, num);
  }, 0);
  return `DOC-2024-${String(max + 1).padStart(3, '0')}`;
};

export const useAdminDoctors = () => {
  const [doctors, setDoctors] = useState<AdminDoctor[]>(ADMIN_DOCTORS);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<DoctorStatusFilter>('all');

  const specialties = useMemo(
    () => Array.from(new Set(doctors.map((doctor) => doctor.specialty))),
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

  const deleteDoctor = (id: string) =>
    setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));

  const addDoctor = (data: AdminDoctorInput) =>
    setDoctors((prev) => [{ ...data, id: generateDoctorId(prev) }, ...prev]);

  const updateDoctor = (id: string, data: AdminDoctorInput) =>
    setDoctors((prev) => prev.map((doctor) => (doctor.id === id ? { ...doctor, ...data } : doctor)));

  const assignSpecialty = (id: string, nextSpecialty: string) =>
    setDoctors((prev) =>
      prev.map((doctor) => (doctor.id === id ? { ...doctor, specialty: nextSpecialty } : doctor)),
    );

  return {
    doctors: filteredDoctors,
    allDoctors: doctors,
    stats: ADMIN_DOCTOR_STATS,
    specialties,
    total: ADMIN_TOTAL_DOCTORS - ADMIN_DOCTORS.length + doctors.length,
    search,
    setSearch,
    specialty,
    setSpecialty,
    statusFilter,
    setStatusFilter,
    deleteDoctor,
    addDoctor,
    updateDoctor,
    assignSpecialty,
  };
};

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

export type DepartmentSort = 'name-asc' | 'name-desc' | 'doctors-desc';

export type AdminDepartmentInput = Omit<AdminDepartment, 'id'>;

const generateDepartmentId = (existing: AdminDepartment[]): string =>
  `KH${String(existing.length + 1).padStart(2, '0')}`;

export const useAdminDepartments = () => {
  const [departments, setDepartments] = useState<AdminDepartment[]>(ADMIN_DEPARTMENTS);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<DepartmentSort>('name-asc');

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

  const deleteDepartment = (id: string) =>
    setDepartments((prev) => prev.filter((dept) => dept.id !== id));

  const addDepartment = (data: AdminDepartmentInput) =>
    setDepartments((prev) => [{ ...data, id: generateDepartmentId(prev) }, ...prev]);

  const updateDepartment = (id: string, data: AdminDepartmentInput) =>
    setDepartments((prev) => prev.map((dept) => (dept.id === id ? { ...dept, ...data } : dept)));

  return {
    departments: visibleDepartments,
    stats: ADMIN_DEPARTMENT_STATS,
    search,
    setSearch,
    sort,
    setSort,
    deleteDepartment,
    addDepartment,
    updateDepartment,
  };
};

export type ReviewRatingFilter = number | 'all';

export const useAdminReviews = () => {
  const [reviews, setReviews] = useState<AdminReview[]>(ADMIN_REVIEWS);
  const [department, setDepartment] = useState<string>('all');
  const [rating, setRating] = useState<ReviewRatingFilter>('all');
  const [date, setDate] = useState('');

  const departments = useMemo(
    () => Array.from(new Set(ADMIN_REVIEWS.map((review) => review.department))),
    [],
  );

  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) => {
        const matchesDept = department === 'all' || review.department === department;
        const matchesRating = rating === 'all' || review.rating === rating;
        return matchesDept && matchesRating;
      }),
    [reviews, department, rating],
  );

  const setReviewStatus = (id: string, status: ReviewStatus) =>
    setReviews((prev) => prev.map((review) => (review.id === id ? { ...review, status } : review)));

  const resetFilters = () => {
    setDepartment('all');
    setRating('all');
    setDate('');
  };

  return {
    reviews: filteredReviews,
    stats: ADMIN_REVIEW_STATS,
    total: ADMIN_REVIEW_TOTAL,
    departments,
    department,
    setDepartment,
    rating,
    setRating,
    date,
    setDate,
    setReviewStatus,
    resetFilters,
  };
};

export type AppointmentStatusFilter = AppointmentStatus | 'all';

export type AdminAppointmentInput = Omit<AdminAppointment, 'id' | 'patientInitials' | 'status'> & {
  status?: AppointmentStatus;
};

const initialsOf = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(-2)
    .join('')
    .toUpperCase();

export const useAdminAppointments = () => {
  const [appointments, setAppointments] = useState<AdminAppointment[]>(ADMIN_APPOINTMENTS);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatusFilter>('all');

  const filtered = useMemo(
    () =>
      appointments.filter(
        (appointment) => statusFilter === 'all' || appointment.status === statusFilter,
      ),
    [appointments, statusFilter],
  );

  const setAppointmentStatus = (id: string, status: AppointmentStatus) =>
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment,
      ),
    );

  const addAppointment = (data: AdminAppointmentInput) =>
    setAppointments((prev) => [
      {
        ...data,
        id: `#LH-${10293 + prev.length + 1}`,
        patientInitials: initialsOf(data.patientName),
        status: data.status ?? 'pending',
      },
      ...prev,
    ]);

  return {
    appointments: filtered,
    stats: ADMIN_APPOINTMENT_STATS,
    total: ADMIN_APPOINTMENT_TOTAL,
    statusFilter,
    setStatusFilter,
    setAppointmentStatus,
    addAppointment,
  };
};

export type AuditActionFilter = AuditActionType | 'all';

export const useAdminAuditLog = () => {
  const [actor, setActor] = useState<string>('all');
  const [actionType, setActionType] = useState<AuditActionFilter>('all');
  const [timeframe, setTimeframe] = useState<string>('today');

  const actors = useMemo(
    () => Array.from(new Set(ADMIN_AUDIT_LOGS.map((log) => log.actorName))),
    [],
  );

  const logs = useMemo(
    () =>
      ADMIN_AUDIT_LOGS.filter((log) => {
        const matchesActor = actor === 'all' || log.actorName === actor;
        const matchesAction = actionType === 'all' || log.actionType === actionType;
        return matchesActor && matchesAction;
      }),
    [actor, actionType],
  );

  return {
    logs,
    summary: ADMIN_AUDIT_SUMMARY,
    total: ADMIN_AUDIT_TOTAL,
    actors,
    actor,
    setActor,
    actionType,
    setActionType,
    timeframe,
    setTimeframe,
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
