import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Save, UserPen } from 'lucide-react';
import { User } from '../../../../types';
import Button from '../../../../components/ui/Button';
import { DoctorProfileSettings } from '../../types';
import { getDepartmentLabel } from '../../../../constants/clinicSpecialties';
import { getRoleProfilePath } from '../../../../pages/shared/roleConfig';
import DoctorProfileSummaryCard from './DoctorProfileSummaryCard';

interface DoctorProfileSettingsSectionProps {
  user: User;
  profile: DoctorProfileSettings;
  onChange: (field: keyof DoctorProfileSettings, value: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

const fieldClassName =
  'w-full px-4 py-2.5 text-sm border border-[#c3c6d6]/60 rounded-xl outline-none transition-all bg-white text-[#191c1e] placeholder:text-[#737685] focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10';

const DoctorProfileSettingsSection: React.FC<DoctorProfileSettingsSectionProps> = ({
  user,
  profile,
  onChange,
  onSave,
  isSaving,
}) => (
  <div className="space-y-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[#c3c6d6]/60 bg-[#f8f9fb] px-4 py-3">
      <p className="text-sm text-[#434654]">
        Họ tên, email, số điện thoại và ảnh đại diện được quản lý tại trang hồ sơ cá nhân.
      </p>
      <Link
        to={getRoleProfilePath()}
        state={{ from: '/doctor/cai-dat' }}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#003d9b] px-4 py-2 text-sm text-white hover:bg-[#002d75] transition-colors shrink-0"
      >
        <UserPen size={15} />
        Chỉnh sửa hồ sơ cá nhân
      </Link>
    </div>

    <div className="grid gap-5 lg:grid-cols-[minmax(240px,280px)_1fr] lg:items-start">
      <DoctorProfileSummaryCard user={user} profile={profile} />

      <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 sm:px-6 py-4 border-b border-[#c3c6d6]/40">
          <div>
            <h2 className="text-base font-semibold text-[#191c1e]">Thông tin chuyên môn</h2>
            <p className="text-xs text-[#737685] mt-0.5">Hiển thị trên hồ sơ bác sĩ công khai</p>
          </div>
          <Button
            leftIcon={<Save size={16} />}
            onClick={onSave}
            loading={isSaving}
            size="sm"
            className="shrink-0 bg-[#003d9b] border-[#003d9b] hover:bg-[#002d75]"
          >
            Lưu thay đổi
          </Button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Chuyên khoa</label>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-2.5">
              <span className="text-sm font-medium text-[#334155]">
                {getDepartmentLabel(profile.specialty)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#64748b] ring-1 ring-[#e2e8f0]">
                <Lock size={11} />
                Do quản trị viên sắp xếp
              </span>
            </div>
            <p className="text-xs text-[#64748b]">
              Chuyên khoa được phân công bởi quản trị viên. Vui lòng liên hệ quản trị viên nếu cần thay đổi.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Tiểu sử nghề nghiệp</label>
            <textarea
              rows={6}
              value={profile.biography}
              onChange={(e) => onChange('biography', e.target.value)}
              placeholder="Mô tả kinh nghiệm, học vấn và chuyên môn của bạn..."
              className={`${fieldClassName} resize-y min-h-[140px] leading-relaxed`}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DoctorProfileSettingsSection;
