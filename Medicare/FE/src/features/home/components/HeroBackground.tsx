import React from 'react';

const HERO_IMAGE = `${process.env.PUBLIC_URL}/images/hero-clinic.png`;

const ECG_PATH =
  'M0 40 L40 40 L55 40 L62 18 L70 62 L78 32 L86 40 L120 40 L135 40 L142 22 L150 58 L158 30 L166 40 L220 40 L235 40 L242 20 L250 60 L258 28 L266 40 L320 40 L335 40 L342 24 L350 52 L358 34 L366 40 L420 40 L435 40 L442 16 L450 64 L458 26 L466 40 L520 40 L535 40 L542 22 L550 56 L558 32 L566 40 L620 40 L635 40 L642 18 L650 62 L658 30 L666 40 L720 40 L735 40 L742 20 L750 58 L758 28 L766 40 L820 40 L835 40 L842 24 L850 54 L858 34 L866 40 L920 40 L935 40 L942 18 L950 60 L958 30 L966 40 L1020 40';

const HeroBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    <img
      src={HERO_IMAGE}
      alt=""
      className="hero-image absolute inset-0 h-full w-full object-cover object-[62%_center] lg:object-[68%_center]"
    />

    {/* Overlay cân bằng — trái đủ tối cho chữ, phải lộ ảnh phòng khám */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#021a33]/92 from-0% via-[#043a6b]/55 via-45% to-transparent to-100%" />
    <div className="absolute inset-0 bg-gradient-to-b from-[#021a33]/30 via-transparent to-[#021a33]/70" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_80%_at_12%_45%,rgba(34,211,238,0.22),transparent_60%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_78%_40%,rgba(56,189,248,0.12),transparent_55%)]" />

    {/* Glow đồng bộ ánh sáng cyan trong ảnh */}
    <div className="hero-glow absolute top-[18%] right-[22%] h-56 w-56 rounded-full bg-cyan-300/25 blur-3xl" />
    <div className="hero-glow-delayed absolute bottom-[18%] right-[35%] h-44 w-44 rounded-full bg-sky-400/20 blur-3xl" />

    {/* ECG */}
    <div className="absolute inset-x-0 bottom-[10%] opacity-[0.18]">
      <svg
        viewBox="0 0 1020 80"
        preserveAspectRatio="none"
        className="h-12 w-full text-cyan-200/90 sm:h-14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={ECG_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={ECG_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          opacity="0.25"
          filter="blur(3px)"
        />
      </svg>
    </div>
  </div>
);

export default HeroBackground;
