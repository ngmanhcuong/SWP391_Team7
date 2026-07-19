import React, { useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Calendar,
  ArrowRight,
  Star,
  CheckCircle,
  Heart,
  Eye,
  Brain,
  Baby,
  Bone,
  ChevronRight,
  Stethoscope,
  Users,
  Sparkles,
} from 'lucide-react';
import MainLayout from '../../../components/layout/MainLayout';
import HeroBackground from './HeroBackground';
import HeroStatCard from './HeroStatCard';
import { Card, Avatar } from '../../../components/ui';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';
import { getRoleDashboardPath } from '../../../pages/shared/roleConfig';
import { CLINIC_SPECIALTIES } from '../../../constants/clinicSpecialties';
import { homeApi } from '../api/homeApi';
import type { HomeDoctor, HomeSpecialty } from '../api/homeApi';

interface DisplaySpecialty {
  id: string;
  icon: React.ElementType;
  name: string;
  color: string;
  bg: string;
  desc: string;
}

const SPECIALTY_PRESENTATION = CLINIC_SPECIALTIES.map((item, index) => {
  const icons = [Heart, Bone, Baby, Eye];
  const colors = ['#ef4444', '#8b5cf6', '#ec4899', '#0ea5e9'];
  const backgrounds = ['#fef2f2', '#f5f3ff', '#fdf2f8', '#f0f9ff'];

  return {
    id: item.id,
    icon: icons[index],
    name: item.name,
    color: colors[index],
    bg: backgrounds[index],
  };
});

const PROCESS_STEPS = [
  { num: 1, title: 'Chọn bác sĩ', desc: 'Tìm bác sĩ phù hợp với chuyên khoa cần khám' },
  { num: 2, title: 'Đặt lịch hẹn', desc: 'Chọn ngày giờ phù hợp với lịch của bạn' },
  { num: 3, title: 'Xác nhận', desc: 'Nhận xác nhận và nhắc nhở qua email/SMS' },
  { num: 4, title: 'Khám bệnh', desc: 'Đến khám đúng giờ và nhận kết quả chẩn đoán' },
];

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { data } = useQuery({
    queryKey: ['public', 'home'],
    queryFn: homeApi.getHomeData,
    staleTime: 60_000,
  });

  const specialties = useMemo<DisplaySpecialty[]>(() => {
    const dbSpecialties = data?.featuredSpecialties ?? [];
    if (dbSpecialties.length === 0) {
      return SPECIALTY_PRESENTATION.map((item) => ({
        ...item,
        desc: '0 bác sĩ',
      }));
    }

    return dbSpecialties.map((item: HomeSpecialty) => {
      const presentation =
        SPECIALTY_PRESENTATION.find((spec) => spec.id === item.id) ??
        SPECIALTY_PRESENTATION.find((spec) => spec.name === item.name) ??
        SPECIALTY_PRESENTATION[0];

      return {
        ...presentation,
        name: item.name,
        desc: `${item.doctorCount} bác sĩ`,
      };
    });
  }, [data]);

  const doctors = data?.featuredDoctors ?? [];

  const stats = useMemo(
    () => [
      {
        val: String(data?.stats.doctors ?? 0),
        label: 'Bác sĩ chuyên khoa',
        icon: Stethoscope,
      },
      {
        val: String(data?.stats.patients ?? 0),
        label: 'Bệnh nhân trong hệ thống',
        icon: Users,
      },
      {
        val: data?.stats.satisfactionRate ?? '0%',
        label: 'Đánh giá hài lòng',
        icon: Star,
      },
      { val: '24/7', label: 'Hỗ trợ AI', icon: Sparkles },
    ],
    [data],
  );

  if (isAuthenticated && user) {
    return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  }

  return (
    <MainLayout>
      <section className="relative min-h-[34rem] overflow-hidden sm:min-h-[38rem] lg:min-h-[42rem]">
        <HeroBackground />
        <div className="container relative z-10 flex min-h-[inherit] items-center py-14 sm:py-16 lg:py-20">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="max-w-xl">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-sm">
                <Sparkles size={14} className="text-cyan-200" />
                Tích hợp AI thế hệ mới
              </span>
              <h1
                className="mb-5 text-3xl font-bold leading-[1.15] tracking-tight text-white drop-shadow-sm sm:text-4xl lg:text-[2.85rem]"
                style={{ fontFamily: 'Lexend' }}
              >
                Phòng khám thông minh
                <span className="mt-1 block bg-gradient-to-r from-cyan-200 via-white to-sky-200 bg-clip-text text-transparent">
                  tích hợp AI
                </span>
              </h1>
              <p className="mb-8 max-w-md text-base leading-relaxed text-slate-200/90 sm:text-lg">
                Kết nối bạn với đội ngũ bác sĩ chuyên nghiệp, đặt lịch nhanh và tư vấn sức khỏe thông minh mọi lúc.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/dang-ky">
                  <Button
                    size="lg"
                    className="border-0 bg-gradient-to-r from-cyan-400 to-sky-500 text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-300 hover:to-sky-400 hover:shadow-cyan-400/40 active:scale-[0.98]"
                    rightIcon={<ArrowRight size={16} />}
                  >
                    Đặt lịch ngay
                  </Button>
                </Link>
                <Link to="/bac-si">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 bg-white/5 text-white backdrop-blur-sm hover:border-white/70 hover:bg-white/15 hover:text-white"
                  >
                    Tìm bác sĩ
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-3.5">
              {stats.map((item, index) => (
                <HeroStatCard
                  key={`${item.label}-${item.val}`}
                  value={item.val}
                  label={item.label}
                  icon={item.icon}
                  delay={index * 80}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-b border-gray-100">
        <div className="container py-8 sm:py-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5 mb-8">
            <p className="text-sm font-medium text-gray-700 mb-3">Tìm kiếm nhanh</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="search"
                  placeholder="Nhập chuyên khoa, tên bác sĩ..."
                  className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-400"
                />
              </div>
              <Link to="/bac-si" className="sm:flex-shrink-0">
                <Button size="md" fullWidth className="sm:w-auto sm:min-w-[140px]" leftIcon={<Calendar size={16} />}>
                  Tìm kiếm
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.label}-${item.val}`}
                  className="text-center sm:text-left sm:flex sm:items-center sm:gap-4 bg-white rounded-xl border border-gray-100 px-4 py-4 sm:py-5"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto sm:mx-0 mb-2 sm:mb-0">
                    <Icon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-700" style={{ fontFamily: 'Lexend' }}>
                      {item.val}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-white">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Lexend' }}>
                Chuyên khoa nổi bật
              </h2>
              <p className="text-gray-500 text-sm mt-1">Đội ngũ chuyên gia hàng đầu trong nhiều lĩnh vực y tế</p>
            </div>
            <Link to="/chuyen-khoa" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 w-fit">
              Xem tất cả <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {specialties.map((specialty: DisplaySpecialty) => {
              const Icon = specialty.icon;
              return (
                <Link key={specialty.id} to="/chuyen-khoa">
                  <Card hover padding="md" className="h-full group">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
                      style={{ background: specialty.bg }}
                    >
                      <Icon size={22} style={{ color: specialty.color }} />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">{specialty.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{specialty.desc}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-gray-50">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Lexend' }}>
                Đội ngũ bác sĩ chuyên gia
              </h2>
              <p className="text-gray-500 text-sm mt-1">Những chuyên gia hàng đầu luôn sẵn sàng đồng hành cùng bạn</p>
            </div>
            <Link to="/bac-si" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 w-fit">
              Xem tất cả <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor: HomeDoctor) => (
              <Card key={doctor.id} hover className="flex flex-col">
                <div
                  className="h-28 rounded-xl mb-4 relative overflow-hidden flex items-end p-4"
                  style={{ background: `linear-gradient(135deg, ${doctor.avatarBg}, rgba(37,99,235,0.18))` }}
                >
                  <Avatar name={doctor.name} size="lg" className="border-2 border-white shadow-md" />
                </div>
                <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {doctor.specialty} · {doctor.experience}
                </p>
                <div className="flex items-center gap-1 mt-2 mb-4">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Star key={index} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">{doctor.reviews} đánh giá</span>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button size="sm" variant="outline" fullWidth>
                    Xem hồ sơ
                  </Button>
                  <Link to="/dang-ky" className="flex-1">
                    <Button size="sm" fullWidth>
                      Đặt lịch
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-white">
        <div className="container">
          <div className="text-center max-w-lg mx-auto mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Lexend' }}>
              Quy trình đặt lịch
            </h2>
            <p className="text-gray-500 text-sm">Chỉ 4 bước đơn giản để kết nối với bác sĩ chuyên khoa</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step) => (
              <Card key={step.num} padding="md" className="text-center relative">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-3 shadow-sm">
                  {step.num}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-gray-50">
        <div className="container">
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#1e3a8a] to-[#1a56db]">
            <div className="flex flex-col lg:flex-row items-center gap-8 p-8 sm:p-10 lg:p-12">
              <div className="flex-1 text-white text-center lg:text-left">
                <span className="inline-block text-xs font-medium text-blue-200 bg-white/10 px-3 py-1 rounded-full mb-4">
                  Công nghệ AI
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: 'Lexend' }}>
                  Chăm sóc sức khỏe thông minh hơn
                </h2>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed max-w-md mx-auto lg:mx-0">
                  Phân tích triệu chứng, gợi ý chuyên khoa và theo dõi sức khỏe 24/7 giúp bạn chủ động hơn.
                </p>
                <ul className="space-y-2 mb-8 text-sm text-blue-100 inline-block text-left">
                  {[
                    'Phân tích triệu chứng thông minh',
                    'Gợi ý bác sĩ phù hợp',
                    'Theo dõi sức khỏe liên tục',
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle size={15} className="text-green-400 flex-shrink-0" /> {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/dang-ky">
                  <Button variant="secondary" size="lg" rightIcon={<ArrowRight size={16} />}>
                    Bắt đầu miễn phí
                  </Button>
                </Link>
              </div>
              <div className="flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-white/10 flex items-center justify-center">
                <Brain size={72} className="text-white/50" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
