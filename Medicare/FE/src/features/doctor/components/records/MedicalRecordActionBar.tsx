import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Play,
  Printer,
  Save,
} from 'lucide-react';
import Button from '../../../../components/ui/Button';
import { DOCTOR_PATHS } from '../../utils/doctorPaths';

type ActionBarPlacement = 'top' | 'bottom';

interface MedicalRecordActionBarProps {
  placement?: ActionBarPlacement;
  onSave: () => void;
  onComplete: () => void;
  onSaveAndNext: () => void;
  onPrint?: () => void;
  isSaving: boolean;
  hasNextPatient: boolean;
}

const secondaryButtonClass =
  'text-[#434654] hover:bg-[#f8f9fb] border-transparent rounded-xl font-medium';

const MedicalRecordActionBar: React.FC<MedicalRecordActionBarProps> = ({
  placement = 'bottom',
  onSave,
  onComplete,
  onSaveAndNext,
  onPrint,
  isSaving,
  hasNextPatient,
}) => {
  const isTop = placement === 'top';

  const secondaryActions = (
    <>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<Printer size={15} />}
        onClick={onPrint ?? (() => window.print())}
        className={`${secondaryButtonClass} bg-[#f3f4f6] hover:bg-[#eceef2]`}
      >
        In hồ sơ
      </Button>

      <Link to={DOCTOR_PATHS.patients}>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft size={15} />}
          className={secondaryButtonClass}
        >
          Quay lại danh sách
        </Button>
      </Link>
    </>
  );

  const primaryActions = (
    <>
      <Button
        size="sm"
        leftIcon={<Save size={15} />}
        onClick={onSave}
        loading={isSaving}
        className="bg-[#2563eb] border-[#2563eb] hover:bg-[#1d4ed8] rounded-xl shadow-sm shadow-[#2563eb]/20 disabled:opacity-50"
      >
        Lưu hồ sơ hiện tại
      </Button>

      <Button
        size="sm"
        leftIcon={<CheckCircle2 size={15} />}
        onClick={onComplete}
        loading={isSaving}
        className="bg-amber-500 border-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-sm shadow-amber-500/20 disabled:opacity-50"
      >
        Đã khám xong
      </Button>

      <Button
        size="sm"
        leftIcon={<Play size={15} className="fill-current" />}
        onClick={onSaveAndNext}
        loading={isSaving}
        disabled={!hasNextPatient}
        className="bg-emerald-600 border-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-sm shadow-emerald-600/20"
      >
        Lưu &amp; Khám ca tiếp theo
      </Button>
    </>
  );

  if (isTop) {
    return (
      <div className="rounded-2xl border border-[#c3c6d6]/50 bg-white shadow-sm shadow-[#2563eb]/5 px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">{secondaryActions}</div>
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            {primaryActions}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-40 -mx-1 mt-6">
      <div className="rounded-2xl border border-[#c3c6d6]/50 bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,61,155,0.08)] px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {secondaryActions}
          <div className="hidden sm:block flex-1" />
          <Button
            size="sm"
            leftIcon={<Save size={15} />}
            onClick={onSave}
            loading={isSaving}
            className="bg-[#2563eb] border-[#2563eb] hover:bg-[#1d4ed8] rounded-xl shadow-sm shadow-[#2563eb]/20 sm:ml-auto disabled:opacity-50"
          >
            Lưu hồ sơ hiện tại
          </Button>
          <Button
            size="sm"
            leftIcon={<CheckCircle2 size={15} />}
            onClick={onComplete}
            loading={isSaving}
            className="bg-amber-500 border-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-sm shadow-amber-500/20 disabled:opacity-50"
          >
            Đã khám xong
          </Button>
        </div>

        <div className="mt-3 pt-3 border-t border-[#c3c6d6]/25 flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            leftIcon={<Play size={15} className="fill-current" />}
            onClick={onSaveAndNext}
            loading={isSaving}
            disabled={!hasNextPatient}
            className="bg-emerald-600 border-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-sm shadow-emerald-600/20"
          >
            Lưu &amp; Khám ca tiếp theo
          </Button>
          {!hasNextPatient && (
            <span className="text-xs text-[#737685]">Không còn ca chờ tiếp theo</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordActionBar;
