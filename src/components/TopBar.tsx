import React from 'react';
import { EnvelopeConfig } from '../utils/bouquetConfig';

interface TopBarProps {
  envelope: EnvelopeConfig;
  onOpenLetter: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onReplayBouquet: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenLetter,
  isMusicPlaying,
  onToggleMusic,
  onReplayBouquet
}) => {
  return (
    <>
      {/* Top-Left: Exquisite Bouquet Button */}
      <div
        className="fixed z-50 pointer-events-auto"
        style={{
          top: 'max(16px, env(safe-area-inset-top))',
          left: 'max(16px, env(safe-area-inset-left))'
        }}
      >
        <button
          type="button"
          onClick={onReplayBouquet}
          className="group flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-full bg-black/40 backdrop-blur-md border border-rose-400/30 text-rose-100 hover:text-white hover:border-rose-300 hover:bg-rose-950/60 transition-all text-xs sm:text-sm font-medium shadow-[0_4px_16px_rgba(255,105,180,0.18)] active:scale-95 cursor-pointer"
          title="Xem lại bó hoa"
          aria-label="Xem lại bó hoa"
        >
          <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-300 group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
            >
              {/* Refined floral bouquet vector icon */}
              <circle cx="12" cy="7" r="3.2" fill="#ff69b4" opacity="0.9" />
              <circle cx="8" cy="9.5" r="2.8" fill="#ff85c0" opacity="0.85" />
              <circle cx="16" cy="9.5" r="2.8" fill="#ff85c0" opacity="0.85" />
              <circle cx="12" cy="10.8" r="2.4" fill="#ffb6c1" />
              <path
                d="M7.5 12 L12 21 L16.5 12 Z"
                fill="#f8bbd0"
                opacity="0.65"
                stroke="#ff85c0"
                strokeWidth="0.8"
              />
              <circle cx="12" cy="18" r="1.4" fill="#ffd700" />
              <path
                d="M10.8 19 L9.5 21.5 M13.2 19 L14.5 21.5"
                stroke="#ffd700"
                strokeWidth="0.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="tracking-wide">Bó hoa</span>
        </button>
      </div>

      {/* Top-Right: Exquisite Letter & Music controls */}
      <div
        className="fixed z-50 flex items-center gap-2.5 sm:gap-3 pointer-events-auto"
        style={{
          top: 'max(16px, env(safe-area-inset-top))',
          right: 'max(16px, env(safe-area-inset-right))'
        }}
      >
        {/* Refined Letter Button */}
        <button
          type="button"
          onClick={onOpenLetter}
          className="group relative flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-full bg-black/40 backdrop-blur-md border border-rose-400/30 text-rose-100 hover:text-white hover:border-rose-300 hover:bg-rose-950/60 transition-all text-xs sm:text-sm font-medium shadow-[0_4px_16px_rgba(255,105,180,0.18)] active:scale-95 cursor-pointer"
          title="Mở lá thư"
          aria-label="Mở lá thư"
        >
          <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-300 group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect
                x="2.5"
                y="5"
                width="19"
                height="14"
                rx="2.5"
                fill="rgba(255, 105, 180, 0.2)"
                stroke="#ff85c0"
                strokeWidth="1.4"
              />
              <path
                d="M3 6.5 L12 13.5 L21 6.5"
                stroke="#ff85c0"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="13.5" r="2.4" fill="#e91e63" />
              <path
                d="M11.2 13.2 Q12 12.2 12.8 13.2 Q12 14.2 12 14.5 Q12 14.2 11.2 13.2 Z"
                fill="#fff"
              />
            </svg>
          </span>
          <span className="tracking-wide">Lá thư</span>

          {/* Delicate notification ping dot */}
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        </button>

        {/* Music Play/Pause Toggle */}
        <button
          type="button"
          onClick={onToggleMusic}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 backdrop-blur-md border border-rose-400/30 text-rose-200 hover:text-white hover:border-rose-300 hover:bg-rose-950/60 flex items-center justify-center transition-all shadow-[0_4px_16px_rgba(255,105,180,0.18)] active:scale-90 cursor-pointer"
          title={isMusicPlaying ? "Tắt nhạc" : "Bật nhạc"}
          aria-label={isMusicPlaying ? "Tắt nhạc" : "Bật nhạc"}
        >
          {isMusicPlaying ? (
            <div className="flex items-end justify-center gap-0.5 h-3.5 w-3.5">
              <span className="w-0.5 bg-rose-300 rounded-full animate-[bounce_0.8s_infinite] h-full"></span>
              <span className="w-0.5 bg-rose-400 rounded-full animate-[bounce_0.6s_infinite_0.2s] h-3/4"></span>
              <span className="w-0.5 bg-rose-300 rounded-full animate-[bounce_0.9s_infinite_0.4s] h-4/5"></span>
            </div>
          ) : (
            <svg
              className="w-4 h-4 text-rose-300/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          )}
        </button>
      </div>
    </>
  );
};
