import React from 'react';

export const BtrcLogo = ({ className = 'h-10 w-10', showText = true, inverted = false }) => {
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`;

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative flex items-center justify-center shrink-0 overflow-hidden ${className}`}>
        <img
          src={logoSrc}
          alt="BTRC"
          className="w-full h-full object-contain"
          draggable="false"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`text-base font-bold tracking-tight leading-none ${inverted ? 'text-white' : 'text-[#102A43]'}`}>
              BTRC
            </span>
            <span className={`text-[11px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${inverted ? 'bg-white/10 text-emerald-300 border-white/15' : 'bg-[#10683D]/10 text-[#10683D] border-[#10683D]/20'}`}>
              NEIR
            </span>
          </div>
          <span className={`text-[12px] font-medium leading-tight mt-0.5 truncate ${inverted ? 'text-slate-300' : 'text-[#52677A]'}`}>
            National Equipment Identity Register
          </span>
        </div>
      )}
    </div>
  );
};
