import React from 'react';
import { EnvelopeConfig, LETTER_ASSET_BASE } from '../utils/bouquetConfig';

interface TopBarProps {
  envelope: EnvelopeConfig;
  onOpenLetter: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onReplayBouquet: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  envelope,
  onOpenLetter,
  isMusicPlaying,
  onToggleMusic,
  onReplayBouquet
}) => {
  return (
    <>
      {/* Top-Left: Replay bouquet button */}
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-rose-500/40 text-rose-200 hover:bg-rose-950/80 transition-all text-xs sm:text-sm font-medium shadow-lg hover:border-rose-400 active:scale-95"
          title="Xem lại bó hoa"
          aria-label="Xem lại bó hoa"
        >
          <span className="text-base">💐</span>
          <span className="font-semibold">Bó hoa</span>
        </button>
      </div>

      {/* Top-Right: Letter & Music controls */}
      <div
        className="fixed z-50 flex items-center gap-3 pointer-events-auto"
        style={{
          top: 'max(16px, env(safe-area-inset-top))',
          right: 'max(16px, env(safe-area-inset-right))'
        }}
      >
        {/* Miniature Animated Letter Button */}
        <button
          type="button"
          className="topbar-btn topbar-letter relative group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
          onClick={onOpenLetter}
          title="Mở lá thư"
          aria-label="Mở lá thư"
        >
          <div className="relative w-16 h-11 sm:w-20 sm:h-14 drop-shadow-[0_4px_12px_rgba(255,105,180,0.5)]">
            {/* Base envelope mini */}
            <img
              src={`${LETTER_ASSET_BASE}front.webp`}
              alt=""
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />
            {/* Headline tag */}
            <div className="absolute inset-0 flex items-center justify-center pt-2">
              <span className="text-[10px] sm:text-xs font-bold text-rose-800 bg-white/90 px-1.5 py-0.2 rounded shadow-xs">
                {envelope.headline || '20/10'}
              </span>
            </div>
            {/* Wax seal miniature */}
            <img
              src={`${LETTER_ASSET_BASE}seal-dlove.webp`}
              alt=""
              className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 object-contain"
              draggable={false}
            />
          </div>
          {/* Pulsing indicator */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
        </button>

        {/* Music Play/Pause Toggle */}
        <button
          type="button"
          className="topbar-btn topbar-music w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 backdrop-blur-md border border-rose-500/40 text-rose-200 flex items-center justify-center transition-all hover:bg-rose-950/70 hover:border-rose-400 shadow-lg active:scale-90"
          onClick={onToggleMusic}
          title={isMusicPlaying ? "Tắt nhạc" : "Bật nhạc"}
          aria-label={isMusicPlaying ? "Tắt nhạc" : "Bật nhạc"}
        >
          {isMusicPlaying ? (
            <div className="flex items-end justify-center gap-0.5 h-4 w-4">
              <span className="w-1 bg-rose-400 rounded-full animate-[bounce_0.8s_infinite]"></span>
              <span className="w-1 bg-rose-300 rounded-full animate-[bounce_0.6s_infinite_0.2s]"></span>
              <span className="w-1 bg-rose-400 rounded-full animate-[bounce_0.9s_infinite_0.4s]"></span>
            </div>
          ) : (
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
          )}
        </button>
      </div>
    </>
  );
};
