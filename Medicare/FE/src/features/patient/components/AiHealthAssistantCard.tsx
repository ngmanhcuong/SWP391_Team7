import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquareText, Sparkles, Stethoscope } from 'lucide-react';

const SUGGESTIONS = [
  'Tôi bị đau đầu và sốt nhẹ',
  'Gợi ý chuyên khoa phù hợp',
  'Giải thích kết quả xét nghiệm',
];

const AiHealthAssistantCard: React.FC = () => (
  <section className="group relative overflow-hidden rounded-[24px] border border-slate-200/70 bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-soft-lg">
    <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br from-[#06b6d4]/15 to-[#2563eb]/10 blur-2xl" />

    <div className="relative flex items-start justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#06b6d4] shadow-md shadow-blue-500/25">
          <Sparkles size={22} className="text-white" />
          <span className="absolute inset-0 rounded-2xl ring-2 ring-white/40" />
        </div>
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            Trợ lý sức khỏe AI
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 ring-1 ring-emerald-100">
              Trực tuyến
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Mô tả triệu chứng, AI gợi ý chuyên khoa &amp; bác sĩ phù hợp</p>
        </div>
      </div>
      <span className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-[#2563eb] ring-1 ring-slate-100">
        <Stethoscope size={18} />
      </span>
    </div>

    <div className="relative mt-5 flex flex-wrap gap-2">
      {SUGGESTIONS.map((text) => (
        <Link
          key={text}
          to="/patient/lich-hen"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/60 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:border-[#2563eb]/40 hover:bg-blue-50 hover:text-[#2563eb] transition-colors"
        >
          <MessageSquareText size={13} />
          {text}
        </Link>
      ))}
    </div>

    <Link
      to="/patient/lich-hen"
      className="relative mt-5 flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:shadow-lg hover:brightness-105"
    >
      <span className="inline-flex items-center gap-2">
        <Sparkles size={16} />
        Bắt đầu trò chuyện với AI
      </span>
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
    </Link>
  </section>
);

export default AiHealthAssistantCard;
