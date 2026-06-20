import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  ADMIN_APPOINTMENTS,
  ADMIN_APPOINTMENT_STATS,
  ADMIN_APPOINTMENT_TREND,
  ADMIN_AUDIT_LOGS,
  ADMIN_AUDIT_SUMMARY,
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
  ADMIN_ROOMS,
  ADMIN_ROOM_STATS,
  ADMIN_SPECIALTY_SHARE,
  ADMIN_SUPPLIES,
  ADMIN_SYSTEM_NOTICES,
  ADMIN_TOP_DEPARTMENTS,
  ADMIN_TOP_SPECIALTIES,
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
  AuditLogEntry,
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

const formatNumber = (value: number) => value.toLocaleString('vi-VN');

const STORAGE_KEYS = {
  users: 'medicare_admin_users',
  doctors: 'medicare_admin_doctors',
  departments: 'medicare_admin_departments',
  rooms: 'medicare_admin_rooms',
  appointments: 'medicare_admin_appointments',
  auditLogs: 'medicare_admin_audit_logs',
  profile: 'medicare_admin_profile',
};

const readStored = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeStored = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const usePersistedAdminState = <T,>(key: string, fallback: T): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => readStored(key, fallback));
  const setPersistedValue: Dispatch<SetStateAction<T>> = (next) => {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? (next as (current: T) => T)(prev) : next;
      writeStored(key, resolved);
      return resolved;
    });
  };
  return [value, setPersistedValue];
};

const getAuditTime = () =>
  new Date().toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const appendAuditLog = (data: Pick<AuditLogEntry, 'action' | 'actionType' | 'target'>) => {
  const currentLogs = readStored(STORAGE_KEYS.auditLogs, ADMIN_AUDIT_LOGS);
  const nextLog: AuditLogEntry = {
    id: `al-${Date.now()}`,
    time: getAuditTime(),
    timeAgo: 'vừa xong',
    actorName: 'Admin Chính',
    actorRole: 'Quản trị hệ thống',
    actorInitials: 'AD',
    actorColor: 'bg-emerald-500',
    ip: 'localhost',
    ...data,
  };
  writeStored(STORAGE_KEYS.auditLogs, [nextLog, ...currentLogs]);
};

const getPersonKey = (name: string) =>
  name
    .replace(/^(TS\.|ThS\.|BSCKII\.|BSCKI\.|BS\.)\s*/i, '')
    .replace(/^(TS|ThS|BSCKII|BSCKI|BS)\.?\s*/i, '')
    .trim()
    .toLowerCase();

const slugifyName = (name: string) =>
  getPersonKey(name)
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/(^\.|\.$)/g, '');

const getSyncedAdminUsers = (baseUsers: AdminUser[]): AdminUser[] => {
  const doctors = readStored(STORAGE_KEYS.doctors, ADMIN_DOCTORS);
  const appointments = readStored(STORAGE_KEYS.appointments, ADMIN_APPOINTMENTS);
  const reviews = readStored('medicare_admin_reviews', ADMIN_REVIEWS);
  const today = new Date().toISOString().slice(0, 10);
  const seedUserIds = new Set(ADMIN_USERS.map((user) => user.id));
  const patientNames = [
    ...appointments.map((appointment) => appointment.patientName),
    ...reviews.filter((review) => !review.anonymous).map((review) => review.patientName),
  ];
  const doctorKeys = new Set(doctors.map((doctor) => getPersonKey(doctor.fullName)));
  const patientKeys = new Set(patientNames.map(getPersonKey).filter(Boolean));
  const synced = baseUsers.filter((user) => {
    const key = getPersonKey(user.fullName);
    if (!seedUserIds.has(user.id)) return true;
    if (user.role === 'doctor') return doctorKeys.has(key);
    if (user.role === 'patient') return patientKeys.has(key);
    return true;
  });
  const existingKeys = new Set(synced.map((user) => getPersonKey(user.fullName)));

  doctors.forEach((doctor) => {
    const key = getPersonKey(doctor.fullName);
    if (existingKeys.has(key)) return;
    existingKeys.add(key);
    synced.push({
      id: `sync-doctor-${doctor.id}`,
      fullName: doctor.fullName,
      email: `${slugifyName(doctor.fullName)}@medicare.vn`,
      phone: '09********',
      role: 'doctor',
      status: doctor.status === 'working' ? 'active' : 'inactive',
      createdAt: today,
      lastActiveAt: today,
    });
  });

  patientNames.forEach((patientName) => {
    const key = getPersonKey(patientName);
    if (!key || existingKeys.has(key)) return;
    existingKeys.add(key);
    synced.push({
      id: `sync-patient-${slugifyName(patientName)}`,
      fullName: patientName,
      email: `${slugifyName(patientName)}@patient.local`,
      phone: '09********',
      role: 'patient',
      status: 'active',
      createdAt: today,
      lastActiveAt: today,
    });
  });

  return synced;
};

export const useAdminDashboard = () => {
  const doctors = readStored(STORAGE_KEYS.doctors, ADMIN_DOCTORS);
  const departments = readStored(STORAGE_KEYS.departments, ADMIN_DEPARTMENTS);
  const rooms = readStored(STORAGE_KEYS.rooms, ADMIN_ROOMS);
  const appointments = readStored(STORAGE_KEYS.appointments, ADMIN_APPOINTMENTS);
  const syncedUsers = getSyncedAdminUsers(readStored(STORAGE_KEYS.users, ADMIN_USERS));
  const patientTotal = syncedUsers.filter((user) => user.role === 'patient').length;
  const dashboardStats = ADMIN_DASHBOARD_STATS.map((stat) => {
    if (stat.id === 'total-patients') return { ...stat, value: formatNumber(patientTotal) };
    if (stat.id === 'total-doctors') return { ...stat, value: formatNumber(doctors.length) };
    if (stat.id === 'total-appointments') return { ...stat, value: formatNumber(appointments.length) };
    if (stat.id === 'total-departments') return { ...stat, value: formatNumber(departments.length) };
    if (stat.id === 'total-rooms') return { ...stat, value: formatNumber(rooms.length) };
    return stat;
  });

  return {
    stats: dashboardStats,
    appointmentTrend: ADMIN_APPOINTMENT_TREND,
    newAppointments: ADMIN_NEW_APPOINTMENTS,
    systemNotices: ADMIN_SYSTEM_NOTICES,
    topDepartments: ADMIN_TOP_DEPARTMENTS,
    quarterlyGoal: ADMIN_QUARTERLY_GOAL,
    newUsersToday: ADMIN_NEW_USERS_TODAY,
  };
};

export const useAdminReports = () => {
  const users = getSyncedAdminUsers(readStored(STORAGE_KEYS.users, ADMIN_USERS));
  const doctors = readStored(STORAGE_KEYS.doctors, ADMIN_DOCTORS);
  const rooms = readStored(STORAGE_KEYS.rooms, ADMIN_ROOMS);
  const appointments = readStored(STORAGE_KEYS.appointments, ADMIN_APPOINTMENTS);
  const patientTotal = users.filter((user) => user.role === 'patient').length;
  const completedAppointments = appointments.filter((appointment) => appointment.status === 'completed').length;
  const completionRate = appointments.length
    ? Math.round((completedAppointments / appointments.length) * 100)
    : 0;
  const reportStats = ADMIN_REPORT_STATS.map((stat) => {
    if (stat.id === 'new-patients') return { ...stat, value: formatNumber(patientTotal), progress: Math.min(100, patientTotal * 25) };
    if (stat.id === 'supplies-used') return { ...stat, value: formatNumber(ADMIN_SUPPLIES.reduce((sum, item) => sum + item.used, 0)) };
    if (stat.id === 'completion-rate') return { ...stat, value: `${completionRate}%`, delta: `${completionRate}%`, progress: completionRate };
    return stat;
  });

  return {
    metrics: ADMIN_REPORT_METRICS,
    monthlySeries: ADMIN_MONTHLY_SERIES,
    topSpecialties: ADMIN_TOP_SPECIALTIES,
    stats: reportStats,
    patientTrend: ADMIN_PATIENT_TREND,
    specialtyShare: ADMIN_SPECIALTY_SHARE,
    specialtyTotal: formatNumber(doctors.length),
    supplies: ADMIN_SUPPLIES,
    suppliesTotal: rooms.length + ADMIN_SUPPLIES.length,
  };
};

export const useAdminUsers = () => {
  const [users, setUsers] = usePersistedAdminState<AdminUser[]>(STORAGE_KEYS.users, ADMIN_USERS);
  const syncedUsers = useMemo(() => getSyncedAdminUsers(users), [users]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<AdminUserRoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<AdminUserStatusFilter>('all');

  const filteredUsers = useMemo(
    () =>
      syncedUsers.filter((user) => {
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return (
          matchesRole &&
          matchesStatus &&
          matches(search, user.fullName, user.email, user.phone)
        );
      }),
    [syncedUsers, search, roleFilter, statusFilter],
  );

  const setUserStatus = (id: string, status: AdminUserStatus) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status } : user)));
    appendAuditLog({ action: 'CẬP NHẬT TRẠNG THÁI', actionType: 'update', target: `Tài khoản: ${id}` });
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    appendAuditLog({ action: 'XÓA TÀI KHOẢN', actionType: 'update', target: `Tài khoản: ${id}` });
  };

  const addUser = (data: AdminUserInput) =>
    setUsers((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      appendAuditLog({ action: 'TẠO TÀI KHOẢN', actionType: 'create', target: `${data.fullName} (${data.role})` });
      return [
        {
          ...data,
          id: `manual-user-${Date.now()}`,
          createdAt: today,
          lastActiveAt: today,
        },
        ...prev,
      ];
    });

  const counts = useMemo(
    () => {
      return {
        total: syncedUsers.length,
        active: syncedUsers.filter((user) => user.status === 'active').length,
        suspended: syncedUsers.filter((user) => user.status === 'suspended').length,
        doctors: syncedUsers.filter((user) => user.role === 'doctor').length,
      };
    },
    [syncedUsers],
  );

  return {
    users: filteredUsers,
    totalUsers: counts.total,
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
  const [doctors, setDoctors] = usePersistedAdminState<AdminDoctor[]>(STORAGE_KEYS.doctors, ADMIN_DOCTORS);
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

  const doctorStats = useMemo(
    () =>
      ADMIN_DOCTOR_STATS.map((stat) => {
        if (stat.id === 'total') {
          return { ...stat, value: formatNumber(doctors.length), note: 'tổng hồ sơ' };
        }
        if (stat.id === 'active') {
          const active = doctors.filter((doctor) => doctor.status === 'working').length;
          return { ...stat, value: formatNumber(active), note: 'đang làm việc' };
        }
        if (stat.id === 'specialty') {
          return { ...stat, value: formatNumber(specialties.length), note: 'chuyên khoa' };
        }
        if (stat.id === 'leave') {
          const onLeave = doctors.filter((doctor) => doctor.status === 'on_leave').length;
          return { ...stat, value: formatNumber(onLeave), note: 'nghỉ phép' };
        }
        return stat;
      }),
    [doctors, specialties.length],
  );

  const deleteDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));
    appendAuditLog({ action: 'XÓA HỒ SƠ BÁC SĨ', actionType: 'update', target: `Bác sĩ: ${id}` });
  };

  const addDoctor = (data: AdminDoctorInput) =>
    setDoctors((prev) => {
      appendAuditLog({ action: 'THÊM BÁC SĨ', actionType: 'create', target: `${data.fullName} - ${data.specialty}` });
      return [{ ...data, id: generateDoctorId(prev) }, ...prev];
    });

  const updateDoctor = (id: string, data: AdminDoctorInput) => {
    setDoctors((prev) => prev.map((doctor) => (doctor.id === id ? { ...doctor, ...data } : doctor)));
    appendAuditLog({ action: 'CẬP NHẬT BÁC SĨ', actionType: 'update', target: `${data.fullName} (${id})` });
  };

  const assignSpecialty = (id: string, nextSpecialty: string) => {
    setDoctors((prev) =>
      prev.map((doctor) => (doctor.id === id ? { ...doctor, specialty: nextSpecialty } : doctor)),
    );
    appendAuditLog({ action: 'PHÂN CÔNG KHOA', actionType: 'update', target: `Bác sĩ ${id} -> ${nextSpecialty}` });
  };

  return {
    doctors: filteredDoctors,
    allDoctors: doctors,
    stats: doctorStats,
    specialties,
    total: doctors.length,
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
  const [rooms, setRooms] = usePersistedAdminState<AdminRoom[]>(STORAGE_KEYS.rooms, ADMIN_ROOMS);
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

  const roomStats = useMemo(
    () =>
      ADMIN_ROOM_STATS.map((stat) => {
        if (stat.id === 'total') return { ...stat, value: formatNumber(rooms.length) };
        if (stat.id === 'available') {
          return { ...stat, value: formatNumber(rooms.filter((room) => room.status === 'available').length) };
        }
        if (stat.id === 'maintenance') {
          return { ...stat, value: formatNumber(rooms.filter((room) => room.status === 'maintenance').length) };
        }
        if (stat.id === 'departments') return { ...stat, value: formatNumber(departments.length) };
        return stat;
      }),
    [departments.length, rooms],
  );

  const deleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((room) => room.id !== id));
    appendAuditLog({ action: 'XÓA PHÒNG', actionType: 'update', target: `Phòng: ${id}` });
  };

  const addRoom = (data: AdminRoomInput) =>
    setRooms((prev) => {
      appendAuditLog({ action: 'THÊM PHÒNG', actionType: 'create', target: `${data.name} - ${data.department}` });
      return [{ ...data, id: generateRoomId(prev) }, ...prev];
    });

  const updateRoom = (id: string, data: AdminRoomInput) => {
    setRooms((prev) => prev.map((room) => (room.id === id ? { ...room, ...data } : room)));
    appendAuditLog({ action: 'CẬP NHẬT PHÒNG', actionType: 'update', target: `${data.name} (${id})` });
  };

  return {
    rooms: filteredRooms,
    stats: roomStats,
    departments,
    total: rooms.length,
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

const normalizeDepartmentName = (value: string) => value.toLowerCase().replace(/^khoa\s+/i, '').trim();

const doctorBelongsToDepartment = (doctor: AdminDoctor, department: AdminDepartment) => {
  const deptName = normalizeDepartmentName(department.name);
  const specialty = doctor.specialty.toLowerCase();

  if (deptName.includes('nội')) {
    return (
      specialty.includes('nội') ||
      specialty.includes('tim') ||
      specialty.includes('da liễu')
    );
  }
  if (deptName.includes('ngoại')) return specialty.includes('ngoại');
  if (deptName.includes('nhi')) return specialty.includes('nhi');
  if (deptName.includes('tai')) return specialty.includes('tai') || specialty.includes('mũi') || specialty.includes('họng');
  if (deptName.includes('sản')) return specialty.includes('sản');

  return specialty.includes(deptName);
};

export const useAdminDepartments = () => {
  const [departments, setDepartments] = usePersistedAdminState<AdminDepartment[]>(
    STORAGE_KEYS.departments,
    ADMIN_DEPARTMENTS,
  );
  const doctors = readStored(STORAGE_KEYS.doctors, ADMIN_DOCTORS);
  const rooms = readStored(STORAGE_KEYS.rooms, ADMIN_ROOMS);
  const syncedUsers = getSyncedAdminUsers(readStored(STORAGE_KEYS.users, ADMIN_USERS));
  const patientCount = syncedUsers.filter((user) => user.role === 'patient').length;
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<DepartmentSort>('name-asc');

  const syncedDepartments = useMemo(
    () =>
      departments.map((dept) => ({
        ...dept,
        doctorCount: doctors.filter((doctor) => doctorBelongsToDepartment(doctor, dept)).length,
      })),
    [departments, doctors],
  );

  const departmentStats = useMemo(
    () =>
      ADMIN_DEPARTMENT_STATS.map((stat) => {
        if (stat.id === 'total') return { ...stat, value: formatNumber(syncedDepartments.length) };
        if (stat.id === 'doctors') return { ...stat, value: formatNumber(doctors.length) };
        if (stat.id === 'patients') return { ...stat, value: formatNumber(patientCount) };
        if (stat.id === 'rooms') return { ...stat, value: formatNumber(rooms.length) };
        return stat;
      }),
    [doctors.length, patientCount, rooms.length, syncedDepartments.length],
  );

  const visibleDepartments = useMemo(() => {
    const filtered = syncedDepartments.filter((dept) =>
      matches(search, dept.name, dept.id, dept.description),
    );
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sort === 'name-desc') return b.name.localeCompare(a.name, 'vi');
      if (sort === 'doctors-desc') return b.doctorCount - a.doctorCount;
      return a.name.localeCompare(b.name, 'vi');
    });
    return sorted;
  }, [syncedDepartments, search, sort]);

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((dept) => dept.id !== id));
    appendAuditLog({ action: 'XÓA KHOA', actionType: 'update', target: `Khoa: ${id}` });
  };

  const addDepartment = (data: AdminDepartmentInput) =>
    setDepartments((prev) => {
      appendAuditLog({ action: 'THÊM KHOA', actionType: 'create', target: data.name });
      return [{ ...data, id: generateDepartmentId(prev) }, ...prev];
    });

  const updateDepartment = (id: string, data: AdminDepartmentInput) => {
    setDepartments((prev) => prev.map((dept) => (dept.id === id ? { ...dept, ...data } : dept)));
    appendAuditLog({ action: 'CẬP NHẬT KHOA', actionType: 'update', target: `${data.name} (${id})` });
  };

  return {
    departments: visibleDepartments,
    stats: departmentStats,
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

  const reviewStats = useMemo(
    () =>
      ADMIN_REVIEW_STATS.map((stat) => {
        if (stat.id === 'total') return { ...stat, value: formatNumber(reviews.length) };
        if (stat.id === 'avg') {
          const avg = reviews.length
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;
          return { ...stat, value: avg.toFixed(1) };
        }
        if (stat.id === 'flagged') {
          return { ...stat, value: formatNumber(reviews.filter((review) => review.flagged || review.status === 'hidden').length) };
        }
        if (stat.id === 'month') return { ...stat, value: `${reviews.filter((review) => review.status === 'visible').length} hiển thị` };
        return stat;
      }),
    [reviews],
  );

  const setReviewStatus = (id: string, status: ReviewStatus) => {
    setReviews((prev) => prev.map((review) => (review.id === id ? { ...review, status } : review)));
    appendAuditLog({ action: 'CẬP NHẬT ĐÁNH GIÁ', actionType: 'update', target: `Đánh giá: ${id} -> ${status}` });
  };

  const resetFilters = () => {
    setDepartment('all');
    setRating('all');
    setDate('');
  };

  return {
    reviews: filteredReviews,
    stats: reviewStats,
    total: reviews.length,
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
  const [appointments, setAppointments] = usePersistedAdminState<AdminAppointment[]>(
    STORAGE_KEYS.appointments,
    ADMIN_APPOINTMENTS,
  );
  const [statusFilter, setStatusFilter] = useState<AppointmentStatusFilter>('all');

  const filtered = useMemo(
    () =>
      appointments.filter(
        (appointment) => statusFilter === 'all' || appointment.status === statusFilter,
      ),
    [appointments, statusFilter],
  );

  const appointmentStats = useMemo(
    () =>
      ADMIN_APPOINTMENT_STATS.map((stat) => {
        if (stat.id === 'today') return { ...stat, value: formatNumber(appointments.length) };
        if (stat.id === 'pending') {
          return { ...stat, value: formatNumber(appointments.filter((appointment) => appointment.status === 'pending').length) };
        }
        if (stat.id === 'completed') {
          return { ...stat, value: formatNumber(appointments.filter((appointment) => appointment.status === 'completed').length) };
        }
        if (stat.id === 'cancelled') {
          return { ...stat, value: formatNumber(appointments.filter((appointment) => appointment.status === 'cancelled').length) };
        }
        return stat;
      }),
    [appointments],
  );

  const setAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment,
      ),
    );
    appendAuditLog({ action: 'CẬP NHẬT LỊCH HẸN', actionType: 'booking', target: `${id} -> ${status}` });
  };

  const addAppointment = (data: AdminAppointmentInput) =>
    setAppointments((prev) => [
      (() => {
        const id = `#LH-${10293 + prev.length + 1}`;
        appendAuditLog({ action: 'TẠO LỊCH HẸN', actionType: 'booking', target: `${id} - ${data.patientName}` });
        return {
          ...data,
          id,
          patientInitials: initialsOf(data.patientName),
          status: data.status ?? 'pending',
        };
      })(),
      ...prev,
    ]);

  return {
    appointments: filtered,
    stats: appointmentStats,
    total: appointments.length,
    statusFilter,
    setStatusFilter,
    setAppointmentStatus,
    addAppointment,
  };
};

export type AuditActionFilter = AuditActionType | 'all';

export const useAdminAuditLog = () => {
  const [auditLogs, setAuditLogs] = useState(() => readStored(STORAGE_KEYS.auditLogs, ADMIN_AUDIT_LOGS));
  const [actor, setActor] = useState<string>('all');
  const [actionType, setActionType] = useState<AuditActionFilter>('all');
  const [timeframe, setTimeframe] = useState<string>('today');

  const actors = useMemo(
    () => Array.from(new Set(auditLogs.map((log) => log.actorName))),
    [auditLogs],
  );

  const logs = useMemo(
    () =>
      auditLogs.filter((log) => {
        const matchesActor = actor === 'all' || log.actorName === actor;
        const matchesAction = actionType === 'all' || log.actionType === actionType;
        return matchesActor && matchesAction;
      }),
    [actor, actionType, auditLogs],
  );

  const auditSummary = useMemo(
    () =>
      ADMIN_AUDIT_SUMMARY.map((item) => {
        if (item.id === 'new-acc') {
          return { ...item, value: formatNumber(auditLogs.filter((log) => log.actionType === 'create').length), note: 'tạo mới' };
        }
        if (item.id === 'new-appt') {
          return { ...item, value: formatNumber(auditLogs.filter((log) => log.actionType === 'booking').length), note: 'lịch hẹn' };
        }
        if (item.id === 'abnormal') return { ...item, value: formatNumber(auditLogs.filter((log) => log.actionType === 'update').length), note: 'cập nhật' };
        return item;
      }),
    [auditLogs],
  );

  const refreshAuditLogs = () => setAuditLogs(readStored(STORAGE_KEYS.auditLogs, ADMIN_AUDIT_LOGS));

  return {
    logs,
    summary: auditSummary,
    total: auditLogs.length,
    actors,
    actor,
    setActor,
    actionType,
    setActionType,
    timeframe,
    setTimeframe,
    refreshAuditLogs,
  };
};

export const useAdminProfile = () => {
  const [profile, setProfile] = useState<AdminProfileForm>(() =>
    readStored(STORAGE_KEYS.profile, DEFAULT_ADMIN_PROFILE),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const updateField = <K extends keyof AdminProfileForm>(field: K, value: AdminProfileForm[K]) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const resetProfile = () => setProfile(readStored(STORAGE_KEYS.profile, DEFAULT_ADMIN_PROFILE));

  const saveProfile = async (nextProfile: AdminProfileForm = profile) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    // Demo lưu localStorage. Sau này thay dòng này bằng API update profile lên database.
    writeStored(STORAGE_KEYS.profile, nextProfile);
    window.dispatchEvent(new CustomEvent('medicare-admin-profile-updated', { detail: nextProfile }));
    setProfile(nextProfile);
    appendAuditLog({ action: 'CẬP NHẬT HỒ SƠ', actionType: 'update', target: `Admin: ${nextProfile.fullName}` });
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
