import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Paperclip, Sparkles, Stethoscope, X } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { MIN_SYMPTOM_LENGTH } from '../constants/appointmentBookingSteps';

interface SymptomInputSectionProps {
  symptoms: string;
  isAnalyzing: boolean;
  canAnalyze: boolean;
  onSymptomsChange: (value: string) => void;
  onAnalyze: () => void;
}

interface UploadedImage {
  id: string;
  file: File;
  url: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const SpeechRecognitionImpl: SpeechRecognitionConstructor | undefined =
  typeof window !== 'undefined'
    ? (window as unknown as {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
      }).SpeechRecognition ??
      (window as unknown as {
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
      }).webkitSpeechRecognition
    : undefined;

const SymptomInputSection: React.FC<SymptomInputSectionProps> = ({
  symptoms,
  isAnalyzing,
  canAnalyze,
  onSymptomsChange,
  onAnalyze,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const symptomsRef = useRef(symptoms);
  symptomsRef.current = symptoms;

  const speechSupported = Boolean(SpeechRecognitionImpl);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      images.forEach((image) => URL.revokeObjectURL(image.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopRecording = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsRecording(false);
  };

  const startRecording = () => {
    if (!SpeechRecognitionImpl) {
      setVoiceError('Trình duyệt của bạn không hỗ trợ ghi âm giọng nói. Vui lòng dùng Chrome hoặc Edge.');
      return;
    }

    setVoiceError(null);
    const recognition = new SpeechRecognitionImpl();
    recognition.lang = 'vi-VN';
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = '';
    const baseText = symptomsRef.current ? `${symptomsRef.current.trim()} ` : '';

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }
      onSymptomsChange(`${baseText}${finalTranscript}${interim}`.trimStart());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setVoiceError('Vui lòng cho phép truy cập micro để sử dụng tính năng ghi âm.');
      } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
        setVoiceError('Không thể ghi âm. Vui lòng thử lại.');
      }
      stopRecording();
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith('image/'),
    );
    if (files.length === 0) return;

    const next = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...next]);
    event.target.value = '';
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((image) => image.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((image) => image.id !== id);
    });
  };

  return (
    <div className="bg-white border border-slate-200/70 rounded-[24px] shadow-soft p-6 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Stethoscope size={18} className="text-[#2563eb] shrink-0" />
          <h2 className="text-xl font-bold text-slate-900">Mô tả triệu chứng của bạn</h2>
        </div>
        <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
          Tối thiểu {MIN_SYMPTOM_LENGTH} ký tự
        </span>
      </div>

      <div className="relative">
        <textarea
          value={symptoms}
          onChange={(event) => onSymptomsChange(event.target.value)}
          placeholder={'Hãy mô tả tình trạng sức khỏe, các cơn đau hoặc biểu hiện bất thường\nmà bạn đang gặp phải...'}
          rows={8}
          className="w-full min-h-[220px] resize-y rounded-xl border border-slate-200 bg-slate-50 px-6 py-6 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 focus:bg-white transition-all"
        />
        {isRecording && (
          <span className="absolute top-3 right-4 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-100">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            Đang nghe...
          </span>
        )}
      </div>

      {voiceError && (
        <p className="text-xs font-medium text-rose-600 -mt-1">{voiceError}</p>
      )}

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200"
            >
              <img src={image.url} alt={image.file.name} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Xóa ảnh"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesSelected}
        className="hidden"
      />

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={toggleRecording}
            disabled={!speechSupported}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isRecording
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isRecording ? (
              <MicOff size={14} className="text-rose-600" />
            ) : (
              <Mic size={14} className="text-emerald-600" />
            )}
            {isRecording ? 'Dừng ghi âm' : 'Ghi âm'}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Paperclip size={14} className="text-[#2563eb]" />
            Tải ảnh triệu chứng
            {images.length > 0 && (
              <span className="ml-0.5 rounded-full bg-blue-50 px-1.5 text-[10px] font-bold text-[#2563eb]">
                {images.length}
              </span>
            )}
          </button>
        </div>

        <Button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          loading={isAnalyzing}
          leftIcon={<Sparkles size={18} />}
          className="!bg-[#2563eb] !border-[#2563eb] hover:!bg-[#1d4ed8] !rounded-lg !px-8 !py-3 !text-base shrink-0"
        >
          Phân tích bằng AI
        </Button>
      </div>
    </div>
  );
};

export default SymptomInputSection;
