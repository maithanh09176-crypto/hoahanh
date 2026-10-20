import React, { useEffect, useState } from 'react';

interface PhotoModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ imageUrl, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageUrl]);

  if (!imageUrl) return null;

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-300 select-none ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleDismiss}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Sleek Minimalist Close Button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-4 right-4 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-rose-950/80 border border-rose-300/40 text-rose-100 flex items-center justify-center text-xl font-light shadow-xl backdrop-blur-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Đóng ảnh"
        style={{
          top: 'max(16px, env(safe-area-inset-top))',
          right: 'max(16px, env(safe-area-inset-right))'
        }}
      >
        ✕
      </button>

      {/* High-Resolution Centered Image */}
      <div
        className={`relative max-w-[92vw] max-h-[85vh] transition-transform duration-300 ${
          isClosing ? 'scale-95' : 'scale-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt=""
          className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-2xl shadow-[0_15px_50px_rgba(255,105,180,0.35)] border border-rose-300/35 transition-all duration-200"
          draggable={false}
        />
      </div>
    </div>
  );
};
