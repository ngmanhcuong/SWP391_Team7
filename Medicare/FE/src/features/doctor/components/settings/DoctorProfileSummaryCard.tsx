import React, { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { User } from '../../../../types';
import { DoctorProfileSettings } from '../../types';
import { getAvatarUrl } from '../../../../utils/avatar';
import { getDepartmentLabel } from '../../../../constants/clinicSpecialties';

interface DoctorProfileSummaryCardProps {
  user: User;
  profile: DoctorProfileSettings;
  onAvatarUpload: (file: File) => void;
  isUploadingAvatar?: boolean;
}

const DoctorProfileSummaryCard: React.FC<DoctorProfileSummaryCardProps> = ({
  user,
  profile,
  onAvatarUpload,
  isUploadingAvatar = false,
}) => {
  const avatarUrl = getAvatarUrl(user.avatar);
  const [imgError, setImgError] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  const displayName = profile.fullName.startsWith('BS.') ? profile.fullName : `BS. ${profile.fullName}`;
  const currentImage = uploadedImage ?? (avatarUrl && !imgError ? avatarUrl : null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      window.alert('Vui lòng chọn một tệp ảnh hợp lệ.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      window.alert('Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    onAvatarUpload(file);
    event.target.value = '';
  };

  return (
    <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#2563eb]/5 p-5 sm:p-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="relative mx-auto w-full max-w-[220px] aspect-square rounded-2xl overflow-hidden bg-[#eff6ff] mb-5 group">
        {currentImage ? (
          <img
            src={currentImage}
            alt={displayName}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2563eb] to-[#1a56db] text-white text-4xl font-bold">
            {profile.fullName
              .split(' ')
              .filter(Boolean)
              .slice(-2)
              .map((part) => part[0])
              .join('')
              .toUpperCase()}
          </div>
        )}

        <button
          type="button"
          disabled={isUploadingAvatar}
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 py-2 bg-black/50 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed disabled:opacity-100"
          aria-label="Đổi ảnh đại diện"
        >
          <Camera size={14} />
          {isUploadingAvatar ? 'Đang tải ảnh...' : 'Đổi ảnh'}
        </button>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-lg font-bold text-[#191c1e]">{displayName}</h2>
        <p className="text-sm text-[#737685]">{getDepartmentLabel(profile.specialty)}</p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
            {profile.status === 'active' ? 'Active' : 'Inactive'}
          </span>
          <span className="inline-flex items-center rounded-full bg-[#f8f9fb] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#737685] ring-1 ring-[#c3c6d6]/50">
            ID: {profile.doctorId}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileSummaryCard;
