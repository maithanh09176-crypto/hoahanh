import React, { useState, useEffect, useRef } from 'react';
import { LetterConfig, LETTER_ASSET_BASE, formatLetterText } from '../utils/bouquetConfig';

interface LetterModalProps {
  open: boolean;
  onClose: () => void;
  letter: LetterConfig;
}

export const LetterModal: React.FC<LetterModalProps> = ({ open, onClose, letter }) => {
  const [envelopeState, setEnvelopeState] = useState<'closed' | 'opening' | 'open'>('closed');
  const [photoZoom, setPhotoZoom] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const parsed = formatLetterText(letter.text);
  const envelope = letter.envelope;

  const [scale, setScale] = useState(0.85);

  useEffect(() => {
    const updateScale = () => {
      const h = window.innerHeight;
      const w = window.innerWidth;
      const s = Math.min(1, Math.min((h - 80) / 920, (w - 32) / 720));
      setScale(Math.max(0.45, Math.min(1, s)));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (open) {
      setIsClosing(false);
      setEnvelopeState('closed');
      setPhotoZoom(false);
      // Auto open envelope after a brief delay so user sees the initial folded envelope
      const t = setTimeout(() => {
        handleOpenEnvelope();
      }, 700);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  const handleOpenEnvelope = () => {
    if (envelopeState !== 'closed') return;
    setEnvelopeState('opening');
    setTimeout(() => {
      setEnvelopeState('open');
    }, 600);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  return (
    <dialog
      ref={dialogRef}
      className={`fl-modal ${open ? 'fl-arriving' : ''} ${isClosing ? 'fl-leaving' : ''}`}
      aria-label="Lá thư hoa"
      open
      style={{
        display: 'flex',
        zIndex: 1000,
        backgroundColor: 'rgba(10, 4, 14, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
    >
      <header className="fl-toolbar">
        <button
          className="fl-close"
          type="button"
          onClick={handleClose}
          aria-label="Đóng lá thư"
        >
          ×
        </button>
      </header>

      <main
        className="fl-main is-fitted"
        style={{
          ['--letter-scale' as any]: scale,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div className="fl-artwork" style={{ visibility: 'visible' }}>
          <section
            className={`gift-scene ${envelopeState === 'open' ? 'flap-is-back' : ''}`}
            data-state={envelopeState}
            data-focus={photoZoom ? 'photo' : 'letter'}
            aria-label="Phong thư hoa"
          >
            <div className="envelope">
              {/* Envelope back */}
              <div className="envelope-back" aria-hidden="true" />

              {/* Envelope Flap with 3D Hinge */}
              <div className="flap-hinge" aria-hidden="true">
                <div
                  className="flap-rotate"
                  style={{
                    transform:
                      envelopeState === 'open' || envelopeState === 'opening'
                        ? 'rotateX(-180deg)'
                        : 'rotateX(0deg)',
                    transition: 'transform 0.65s cubic-bezier(0.22, 0.75, 0.25, 1)'
                  }}
                >
                  <span className="envelope-flap flap-outside">
                    <img src={`${LETTER_ASSET_BASE}flap-blank.webp`} alt="" draggable={false} />
                    <svg className="envelope-inscription" viewBox="0 0 1349 859" focusable="false">
                      {envelope.topLine && (
                        <text className="envelope-top-line" x="674.5" y="122" fontSize="40">
                          {envelope.topLine}
                        </text>
                      )}
                      {(envelope.topLine || envelope.headline) && (
                        <g className="envelope-divider">
                          <path d="M570 164h74m61 0h74" stroke="currentColor" strokeWidth="2" />
                          <text x="674.5" y="179" fontSize="44" textAnchor="middle" fill="currentColor">
                            ♥
                          </text>
                        </g>
                      )}
                      {envelope.headline && (
                        <text className="envelope-headline" x="674.5" y="310" fontSize="128">
                          {envelope.headline}
                        </text>
                      )}
                      {envelope.bottomLine && (
                        <text className="envelope-bottom-line" x="674.5" y="377" fontSize="32">
                          {envelope.bottomLine}
                        </text>
                      )}
                    </svg>
                  </span>
                  <div className="flap-inside" />
                </div>
              </div>

              {/* Envelope sides */}
              <img
                className="envelope-sides"
                src={`${LETTER_ASSET_BASE}sides.webp`}
                alt=""
                draggable={false}
              />

              {/* The Romantic Letter Paper */}
              <article
                className="letter-paper"
                aria-label="Nội dung lá thư"
                style={{
                  transform:
                    envelopeState === 'open'
                      ? 'translateY(-80px)'
                      : envelopeState === 'opening'
                      ? 'translateY(-20px)'
                      : 'translateY(120px)',
                  opacity: envelopeState === 'closed' ? 0 : 1,
                  transition: 'transform 0.85s cubic-bezier(0.22, 0.75, 0.25, 1), opacity 0.5s ease',
                  zIndex: envelopeState === 'open' ? 35 : 15
                }}
              >
                <div className="paper-border" aria-hidden="true" />
                <img
                  className="flower flower-top"
                  src={`${LETTER_ASSET_BASE}flower-front.webp`}
                  alt=""
                  draggable={false}
                />

                <div
                  className="letter-copy"
                  style={{ width: letter.photo ? '58%' : '100%', position: 'relative', zIndex: 10 }}
                >
                  <div className="letter-copy-content">
                    {parsed.greeting && (
                      <h1 className="text-xl md:text-2xl font-bold text-rose-800 mb-3 flex items-center gap-1.5 justify-center">
                        {parsed.greeting}
                        {!parsed.greeting.includes('<3') && !parsed.greeting.includes('♥') && (
                          <span className="greeting-heart text-rose-500 text-lg" aria-hidden="true">
                            ♥
                          </span>
                        )}
                      </h1>
                    )}

                    <div className="letter-paragraphs space-y-2 text-gray-800 leading-snug text-[13.5px] md:text-[15px] font-normal">
                      {parsed.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>

                    {parsed.signature && (
                      <div className="mt-4 text-right">
                        <p className="letter-signature text-base md:text-lg font-semibold text-rose-900 font-['Dancing_Script',cursive]">
                          {parsed.signature}
                        </p>
                        <svg className="signature-line ml-auto w-32 h-4 text-rose-400" viewBox="0 0 220 18" aria-hidden="true">
                          <path d="M4 13Q99-4 211 7" fill="none" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Romantic Memory Photo on Letter */}
                {letter.photo && (
                  <button
                    className={`letter-photo ${photoZoom ? 'scale-110 shadow-2xl' : ''}`}
                    type="button"
                    aria-label={photoZoom ? "Thu nhỏ ảnh và đọc lá thư" : "Phóng to ảnh trên lá thư"}
                    onClick={() => setPhotoZoom(!photoZoom)}
                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  >
                    <img
                      className="photo-backdrop"
                      src={`${LETTER_ASSET_BASE}watercolor.webp`}
                      alt=""
                      draggable={false}
                    />
                    <span className="photo-glow" aria-hidden="true" />
                    <span className="photo-viewport block overflow-hidden rounded-xl">
                      <img
                        src={letter.photo}
                        alt="Ảnh kỷ niệm trên lá thư"
                        draggable={false}
                        className="w-full h-full object-cover transition-transform duration-300"
                        style={{ transform: photoZoom ? 'scale(1.15)' : 'scale(1)' }}
                      />
                    </span>
                    <span className="photo-hint text-[10px] tracking-wider text-rose-700 bg-white/80 rounded-full px-2 py-0.5 mt-1 shadow-xs inline-block">
                      {photoZoom ? 'Chạm để thu nhỏ' : 'Chạm để ngắm ảnh'}
                    </span>
                  </button>
                )}

                <img
                  className="flower flower-photo"
                  src={`${LETTER_ASSET_BASE}flower-front.webp`}
                  alt=""
                  draggable={false}
                />
              </article>

              {/* Envelope front & wax seal */}
              <img
                className="envelope-front"
                src={`${LETTER_ASSET_BASE}front.webp`}
                alt=""
                draggable={false}
              />
              <img
                className="wax-seal"
                src={`${LETTER_ASSET_BASE}seal-dlove.webp`}
                alt=""
                draggable={false}
                style={{
                  opacity: envelopeState === 'open' ? 0 : 1,
                  transform: envelopeState === 'open' ? 'scale(0.8) translateY(-20px)' : 'scale(1)',
                  transition: 'all 0.4s ease'
                }}
              />

              {envelopeState === 'closed' && (
                <button
                  className="envelope-hit"
                  type="button"
                  aria-label="Mở phong thư"
                  onClick={handleOpenEnvelope}
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </dialog>
  );
};
