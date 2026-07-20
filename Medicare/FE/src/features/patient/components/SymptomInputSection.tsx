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
    <div className="flex h-full flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-200">
            <Stethoscope size={18} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Mô tả triệu chứng của bạn</h2>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
          Tối thiểu {MIN_SYMPTOM_LENGTH} ký tự
        </span>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={symptoms}
          onChange={(event) => onSymptomsChange(event.target.value)}
          placeholder={'Hãy mô tả tình trạng sức khỏe, các cơn đau hoặc biểu hiện bất thường\nmà bạn đang gặp phải...'}
          rows={8}
          className="w-full min-h-[200px] resize-y rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-5 text-[15px] leading-relaxed text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
        />
        {isRecording && (
          <span className="absolute top-3 right-4 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-600 shadow-sm ring-1 ring-rose-100">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            Đang nghe...
          </span>
        )}
      </div>

      {voiceError && (
        <p className="text-xs font-medium text-rose-600 -mt-2">{voiceError}</p>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative h-20 w-20 overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-transform hover:scale-105"
            >
              <img src={image.url} alt={image.file.name} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
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

      {/* Action bar */}
      <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={toggleRecording}
            disabled={!speechSupported}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
              isRecording
                ? 'border-rose-200 bg-rose-50 text-rose-600 shadow-sm shadow-rose-100'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
            }`}
          >
            {isRecording ? (
              <MicOff size={15} className="text-rose-500" />
            ) : (
              <Mic size={15} className="text-emerald-500" />
            )}
            {isRecording ? 'Dừng ghi âm' : 'Ghi âm'}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
          >
            <Paperclip size={15} className="text-blue-500" />
            Tải ảnh triệu chứng
            {images.length > 0 && (
              <span className="ml-0.5 rounded-full bg-blue-100 px-1.5 text-[10px] font-bold text-blue-600">
                {images.length}
              </span>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className={`group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl px-7 py-3 text-sm font-semibold text-white shadow-md transition-all ${
            canAnalyze && !isAnalyzing
              ? 'bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 active:scale-[0.98]'
              : 'cursor-not-allowed bg-gray-300 shadow-none'
          }`}
        >
          {/* Shimmer effect */}
          {canAnalyze && !isAnalyzing && (
            <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          )}
          {isAnalyzing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Đang phân tích...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Phân tích bằng AI
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SymptomInputSection;
