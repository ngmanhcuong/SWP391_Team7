import React, { useMemo } from 'react';
import { Building2, DoorOpen, Stethoscope } from 'lucide-react';
import { Card, Spinner } from '../../components/ui';
import { useReceptionistCatalog } from '../../features/receptionist/hooks';

const ROOM_MAP: Record<string, { code: string; name: string }[]> = {
  'Khoa Tim mạch': [
    { code: 'TM001', name: 'Phòng TM001 - Khoa Tim mạch' },
    { code: 'TM002', name: 'Phòng TM002 - Khoa Tim mạch' },
  ],
  'Khoa Cơ xương khớp': [
    { code: 'XK001', name: 'Phòng XK001 - Khoa Cơ xương khớp' },
    { code: 'XK002', name: 'Phòng XK002 - Khoa Cơ xương khớp' },
  ],
  'Khoa Sản & Nhi': [
    { code: 'SN001', name: 'Phòng SN001 - Khoa Sản & Nhi' },
    { code: 'SN002', name: 'Phòng SN002 - Khoa Sản & Nhi' },
  ],
  'Khoa Mắt': [
    { code: 'MT001', name: 'Phòng MT001 - Khoa Mắt' },
    { code: 'MT002', name: 'Phòng MT002 - Khoa Mắt' },
  ],
};

const ReceptionistDepartmentsPage: React.FC = () => {
  const { data, isLoading, isError } = useReceptionistCatalog();

  const departments = useMemo(
    () =>
      (data?.departments ?? []).map((department) => ({
        ...department,
        rooms: ROOM_MAP[department.name] ?? [],
      })),
    [data],
  );

  const totalDoctors = useMemo(
    () => departments.reduce((sum, department) => sum + department.doctors.length, 0),
    [departments],
  );
  const totalRooms = useMemo(
    () => departments.reduce((sum, department) => sum + department.rooms.length, 0),
    [departments],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="p-6 text-sm text-red-600">
        Không tải được dữ liệu khoa khám. Vui lòng thử lại sau.
      </Card>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <section className="rounded-[24px] bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#06b6d4] px-8 py-7 text-white shadow-soft-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Quản lý điều phối</p>
        <h1 className="mt-2 text-4xl font-bold">Khoa khám</h1>
        <p className="mt-3 max-w-3xl text-base text-white/90">
          Lễ tân theo dõi các khoa đang hoạt động, danh sách bác sĩ phụ trách và các phòng khám đã
          được phân bổ cho từng khoa.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Tổng số khoa" value={departments.length} icon={<Building2 size={22} />} />
        <SummaryCard label="Bác sĩ phụ trách" value={totalDoctors} icon={<Stethoscope size={22} />} />
        <SummaryCard label="Phòng khám" value={totalRooms} icon={<DoorOpen size={22} />} />
        <SummaryCard
          label="Phân bổ trung bình"
          value={departments.length ? `${(totalDoctors / departments.length).toFixed(1)}` : '0'}
          note="bác sĩ / khoa"
          icon={<Stethoscope size={22} />}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {departments.map((department) => (
          <Card key={department.id} className="overflow-hidden border border-gray-100">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#0f172a]">{department.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">{department.specialtyName}</p>
                </div>
                <div className="rounded-2xl bg-blue-50 px-4 py-2 text-sm font-semibold text-[#1d4ed8]">
                  {department.doctors.length} bác sĩ
                </div>
              </div>
            </div>

            <div className="grid gap-6 px-6 py-6 lg:grid-cols-2">
              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#334155]">
                  <Stethoscope size={16} className="text-[#2563eb]" />
                  Bác sĩ phụ trách
                </p>
                <div className="space-y-2">
                  {department.doctors.map((doctor) => (
                    <div
                      key={doctor}
                      className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm font-medium text-[#1e3a8a]"
                    >
                      {doctor}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#334155]">
                  <DoorOpen size={16} className="text-[#0f766e]" />
                  Phòng khám quản lý
                </p>
                <div className="space-y-2">
                  {department.rooms.map((room) => (
                    <div
                      key={room.code}
                      className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3"
                    >
                      <p className="text-sm font-semibold text-[#065f46]">{room.code}</p>
                      <p className="mt-1 text-sm text-[#0f172a]">{room.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SummaryCard = ({
  label,
  value,
  icon,
  note,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  note?: string;
}) => (
  <Card className="flex items-center gap-4 border border-gray-100 p-5">
    <div className="rounded-2xl bg-blue-50 p-3 text-[#2563eb]">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-[#0f172a]">{value}</p>
      {note ? <p className="mt-1 text-xs text-gray-400">{note}</p> : null}
    </div>
  </Card>
);

export default ReceptionistDepartmentsPage;
