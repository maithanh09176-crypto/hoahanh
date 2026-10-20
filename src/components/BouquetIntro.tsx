import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BOUQUET_PARTS,
  PHOTO_SLOTS,
  BLOOM_FLOWERS,
  ASSET_BASE,
  calculatePolygonClip,
  BouquetPart
} from '../utils/bouquetConfig';

interface BouquetIntroProps {
  onStart: () => void;
  images: string[];
  cutouts: boolean[];
}

export const BouquetIntro: React.FC<BouquetIntroProps> = ({ onStart, images, cutouts }) => {
  const [phase, setPhase] = useState<'loading' | 'flowers' | 'revealing' | 'ready' | 'opening'>('loading');
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [hintText, setHintText] = useState('Đang chuẩn bị bó hoa...');
  const [statusText, setStatusText] = useState('');

  const holdStartRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);
  const bouquetRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  // Transition from loading to flowers
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('flowers');
      setHintText('Em hãy chạm vào bó hoa');
      setStatusText('');
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Reveal flowers when clicked
  const handleReveal = useCallback(() => {
    if (phase !== 'flowers') return;
    setPhase('revealing');
    setHintText('');
    setStatusText('Đang hé lộ ảnh trong bó hoa.');

    setTimeout(() => {
      setPhase('ready');
      setHintText('Mở thiếp ở nơ đó');
      setStatusText('Bó hoa đã sẵn sàng. Giữ bất kỳ chỗ nào trên bó hoa hoặc chạm vào nơ để mở thiệp.');
    }, 1100);
  }, [phase]);

  // Finish hold and enter 3D scene
  const finishHold = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setPhase('opening');
    setHoldProgress(1);
    setIsHolding(false);
    setHintText('');
    setStatusText('Đang mở thiệp...');

    setTimeout(() => {
      onStart();
    }, 500);
  }, [onStart]);

  const updateHold = useCallback(() => {
    const elapsed = performance.now() - holdStartRef.current;
    const p = Math.min(1, elapsed / 850); // ~850ms hold to open
    setHoldProgress(p);

    if (p >= 1) {
      finishHold();
    } else {
      animFrameRef.current = requestAnimationFrame(updateHold);
    }
  }, [finishHold]);

  const startHold = useCallback((e?: React.PointerEvent | React.KeyboardEvent) => {
    if (phase !== 'ready' || hasTriggeredRef.current) return;
    if (e && 'button' in e && e.button !== 0) return;
    setIsHolding(true);
    holdStartRef.current = performance.now();
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(updateHold);
  }, [phase, updateHold]);

  const cancelHold = useCallback(() => {
    if (phase !== 'ready' || hasTriggeredRef.current) return;
    setIsHolding(false);
    cancelAnimationFrame(animFrameRef.current);

    // Smoothly decay hold progress back to 0
    const startP = holdProgress;
    const decayStart = performance.now();
    const decay = () => {
      const el = (performance.now() - decayStart) / 200;
      if (el >= 1) {
        setHoldProgress(0);
      } else {
        setHoldProgress(startP * (1 - el));
        animFrameRef.current = requestAnimationFrame(decay);
      }
    };
    animFrameRef.current = requestAnimationFrame(decay);
  }, [phase, holdProgress]);

  // Window event listeners for global key press
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (phase === 'flowers') {
          handleReveal();
        } else if (phase === 'ready') {
          finishHold();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [phase, handleReveal, finishHold]);

  // Listen to spacebar and enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (phase === 'flowers') {
        handleReveal();
      } else if (phase === 'ready') {
        finishHold();
      }
    } else if (e.code === 'Space' && !e.repeat && phase === 'ready') {
      e.preventDefault();
      startHold(e);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.code === 'Space' && phase === 'ready') {
      e.preventDefault();
      cancelHold();
    }
  };

  const circumference = 2 * Math.PI * 45; // r=45 -> ~282.7

  return (
    <div
      ref={bouquetRef}
      className={`intro bouquet-screen ${isHolding ? 'is-holding' : ''}`}
      data-phase={phase}
      style={{
        ['--hold-progress' as any]: holdProgress,
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
      onPointerDown={phase === 'ready' ? (e) => startHold(e) : undefined}
      onPointerUp={phase === 'ready' ? cancelHold : undefined}
      onPointerCancel={phase === 'ready' ? cancelHold : undefined}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
      role="region"
      aria-label="Bó hoa ảnh dành tặng bạn"
    >
      <section className="bouquet-intro" aria-label="Bó hoa ảnh dành tặng bạn">
        <div
          className="bouquet-stage"
          style={{ cursor: phase === 'flowers' || phase === 'ready' ? 'pointer' : 'default' }}
          onClick={phase === 'flowers' ? handleReveal : undefined}
        >
          {/* Ambient Glow */}
          <div className="bouquet-glow" aria-hidden="true" />

          {/* Bouquet Background Art & Foliage */}
          {BOUQUET_PARTS.map((part: BouquetPart, idx: number) => {
            const style: React.CSSProperties = {
              ['--x' as any]: `${part.x / 10}%`,
              ['--y' as any]: `${part.y / 12.8}%`,
              ['--w' as any]: `${part.width / 10}%`,
              ['--h' as any]: `${part.height / 12.8}%`,
              ['--rotation' as any]: `${part.rotate}deg`,
              ['--flip' as any]: part.flip ? -1 : 1,
              ['--z' as any]: part.z
            };

            return (
              <img
                key={idx}
                className="bouquet-part bouquet-art"
                data-kind={part.kind}
                data-reveal-delay={part.revealDelay}
                style={style}
                src={`${ASSET_BASE}${part.asset}.webp`}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
            );
          })}

          {/* The 6 Romantic Photos In The Bouquet */}
          {PHOTO_SLOTS.map((slot, idx) => {
            const photoUrl = images[idx % images.length];
            const isCutout = cutouts[idx % cutouts.length];
            const clipPath = calculatePolygonClip(slot);

            const style: React.CSSProperties = {
              ['--x' as any]: `${slot.x / 10}%`,
              ['--y' as any]: `${slot.y / 12.8}%`,
              ['--w' as any]: `${slot.width / 10}%`,
              ['--h' as any]: `${slot.height / 12.8}%`,
              ['--rotation' as any]: `${slot.rotate}deg`,
              ['--flip' as any]: 1,
              ['--z' as any]: slot.z,
              clipPath: isCutout ? clipPath : undefined
            };

            return (
              <div
                key={idx}
                className={`bouquet-part bouquet-photo ${isCutout ? 'is-cutout' : 'is-card'}`}
                data-kind="portrait"
                style={style}
                aria-hidden={phase === 'flowers'}
              >
                <img
                  src={photoUrl}
                  alt={`Ảnh kỷ niệm ${idx + 1}`}
                  draggable={false}
                  className="w-full h-full object-cover rounded-xl shadow-md"
                />
              </div>
            );
          })}

          {/* The 6 Cover Flowers That Bloom Away */}
          {BLOOM_FLOWERS.map((flower, idx) => {
            const style: React.CSSProperties = {
              ['--x' as any]: `${flower.x / 10}%`,
              ['--y' as any]: `${flower.y / 12.8}%`,
              ['--w' as any]: `${flower.width / 10}%`,
              ['--h' as any]: `${flower.height / 12.8}%`,
              ['--rotation' as any]: `${flower.rotate}deg`,
              ['--flip' as any]: flower.flip ? -1 : 1,
              ['--z' as any]: flower.z,
              opacity: phase === 'flowers' ? 1 : 0,
              transform:
                phase === 'revealing' || phase === 'ready' || phase === 'opening'
                  ? `translate(-50%, -50%) rotate(${flower.rotate + 15}deg) scale(0.2)`
                  : undefined,
              filter:
                phase === 'revealing' || phase === 'ready' || phase === 'opening'
                  ? 'blur(10px) brightness(1.5)'
                  : undefined,
              transition: 'opacity 0.8s ease, transform 0.9s cubic-bezier(0.22, 0.75, 0.25, 1), filter 0.8s ease',
              pointerEvents: 'none'
            };

            return (
              <img
                key={idx}
                className="bouquet-part bouquet-art bouquet-bloom"
                data-kind="bloom-cover"
                style={style}
                src={`${ASSET_BASE}${flower.asset}.webp`}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
            );
          })}

          {/* Central Ribbon / Bow with Animated Radial Hold Ring */}
          <button
            className="bouquet-part bouquet-bow"
            data-kind="bow"
            type="button"
            disabled={phase !== 'ready'}
            aria-label="Ấn giữ bó hoa"
            aria-describedby="bouquet-hint"
            onClick={phase === 'ready' ? finishHold : phase === 'flowers' ? handleReveal : undefined}
          >
            <img src={`${ASSET_BASE}bow.webp`} alt="" draggable={false} />
            <span className="bouquet-bow-fallback">Ấn giữ bó hoa</span>

            {/* Circular SVG Hold Ring */}
            <svg
              className="bouquet-hold-ring"
              viewBox="0 0 100 100"
              aria-hidden="true"
              style={{
                opacity: phase === 'ready' ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            >
              <circle
                className="bouquet-ring-track"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="4"
              />
              <circle
                className="bouquet-ring-progress"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#ff69b4"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - holdProgress)}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(255, 105, 180, 0.8))',
                  transition: isHolding ? 'none' : 'stroke-dashoffset 0.2s ease-out'
                }}
              />
            </svg>
          </button>

          {/* Button overlay to reveal flowers on tap */}
          {phase === 'flowers' && (
            <button
              className="bouquet-reveal"
              type="button"
              onClick={handleReveal}
              aria-label="Chạm vào bó hoa"
            >
              Chạm vào bó hoa
            </button>
          )}
        </div>

        {/* Footer Hint and Accessibility Status */}
        <footer className="bouquet-footer mt-4 flex flex-col items-center">
          <p id="bouquet-hint" className="bouquet-hint text-white/90 text-sm md:text-base font-medium tracking-wide">
            {hintText}
          </p>
          <div className="bouquet-status sr-only" role="status" aria-live="polite">
            {statusText}
          </div>
        </footer>
      </section>
    </div>
  );
};
