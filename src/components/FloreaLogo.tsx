import React from 'react';

interface FloreaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  monochrome?: boolean;
}

export const FloreaLogo: React.FC<FloreaLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
  monochrome = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const telangColor = monochrome ? 'currentColor' : '#4E3875';
  const rosellaColor = monochrome ? 'currentColor' : '#9B3354';
  const leafColor = monochrome ? 'currentColor' : '#4A6D51';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Botanical Flower Icon Illustration (Telang & Rosella without gradients) */}
      <svg
        className={`${iconSizes[size]} shrink-0`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Minimalist Background Arc */}
        <path
          d="M 32 36 A 30 30 0 0 1 74 36"
          stroke={telangColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* Delicate 4-point star on top right */}
        <path
          d="M 78 18 Q 78 24 84 24 Q 78 24 78 30 Q 78 24 72 24 Q 78 24 78 18 Z"
          fill={telangColor}
        />

        {/* Sage Green Leaf (Base Left) */}
        <path
          d="M 44 48 C 36 44 26 40 24 45 C 22 50 32 58 44 54 Z"
          fill={leafColor}
          opacity="0.85"
        />

        {/* Butterfly Pea Petals (Bunga Telang - Purple / Lavender Left) */}
        <path
          d="M 48 50 C 42 38 28 32 30 24 C 32 16 44 22 48 34 Z"
          fill={telangColor}
          opacity="0.85"
        />
        <path
          d="M 48 50 C 44 32 48 16 52 16 C 56 16 56 32 50 50 Z"
          fill={telangColor}
          opacity="0.95"
        />
        <path
          d="M 49 50 C 53 38 64 26 68 28 C 72 30 64 42 50 50 Z"
          fill={telangColor}
          opacity="0.75"
        />
        {/* Stamen line */}
        <path
          d="M 48 42 L 48 30"
          stroke="#FAF7F2"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="48" cy="29" r="1.5" fill="#FAF7F2" />

        {/* Roselle Flower Petals (Kelopak Rosella - Red / Crimson Right) */}
        <path
          d="M 52 50 C 58 44 68 34 74 38 C 78 42 70 54 54 56 Z"
          fill={rosellaColor}
          opacity="0.9"
        />
        <path
          d="M 52 50 C 54 40 60 32 64 34 C 68 36 62 48 53 54 Z"
          fill={rosellaColor}
          opacity="0.7"
        />
        <path
          d="M 53 53 C 60 50 72 46 76 52 C 78 56 68 62 53 55 Z"
          fill={rosellaColor}
          opacity="0.8"
        />

        {/* Base stem curl */}
        <path
          d="M 46 51 C 48 58 52 64 58 64"
          stroke={telangColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className={`font-serif-brand font-bold tracking-tight leading-none text-[#4E3875] ${titleSizes[size]}`}>
          FLOREA
        </div>
        {showSubtitle && (
          <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-500 mt-1">
            Botanical Infusion · Telang & Rosella
          </span>
        )}
      </div>
    </div>
  );
};
