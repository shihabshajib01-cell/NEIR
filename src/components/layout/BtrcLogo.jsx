import React from 'react';

export const BtrcLogo = ({ className = 'h-10 w-10', showText = true, inverted = false }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative flex items-center justify-center shrink-0 rounded-full bg-white shadow-sm border border-[#D8E0E8] overflow-hidden ${className}`}>
        {/* SVG representation of Bangladesh Government / BTRC Regulatory Emblem */}
        <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer circle */}
          <circle cx="50" cy="50" r="46" fill="#14804A" stroke="#10683D" strokeWidth="2" />
          {/* Inner ring */}
          <circle cx="50" cy="50" r="40" fill="#FFFFFF" />
          {/* Center red circle (Bangladesh flag emblem motif) */}
          <circle cx="50" cy="46" r="18" fill="#DC2626" />
          {/* Radio / Telecom Waves */}
          <path d="M50 18 C32 18, 18 32, 18 50" stroke="#173F5F" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M50 24 C36 24, 25 35, 25 50" stroke="#147D83" strokeWidth="3" strokeLinecap="round" />
          <path d="M50 30 C40 30, 32 38, 32 50" stroke="#14804A" strokeWidth="2.5" strokeLinecap="round" />
          
          <path d="M50 18 C68 18, 82 32, 82 50" stroke="#173F5F" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M50 24 C64 24, 75 35, 75 50" stroke="#147D83" strokeWidth="3" strokeLinecap="round" />
          <path d="M50 30 C60 30, 68 38, 68 50" stroke="#14804A" strokeWidth="2.5" strokeLinecap="round" />

          {/* Tower Antenna Motif */}
          <path d="M50 40 L50 82" stroke="#102A43" strokeWidth="4" strokeLinecap="round" />
          <path d="M38 82 L50 62 L62 82" stroke="#102A43" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="50" cy="38" r="4" fill="#F59E0B" />
          {/* Base ribbon */}
          <path d="M22 84 Q50 92 78 84" stroke="#10683D" strokeWidth="3" fill="none" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className={`text-base font-bold tracking-tight leading-none ${inverted ? 'text-white' : 'text-[#102A43]'}`}>
              BTRC
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#10683D]/15 text-[#10683D] border border-[#10683D]/20">
              NEIR
            </span>
          </div>
          <span className={`text-[12px] font-medium leading-tight mt-0.5 ${inverted ? 'text-slate-300' : 'text-[#52677A]'}`}>
            National Equipment Identity Register
          </span>
        </div>
      )}
    </div>
  );
};
