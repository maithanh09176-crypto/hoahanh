import { useState, useEffect, useRef, useCallback } from 'react';
import { BouquetIntro } from './components/BouquetIntro';
import { ThreeCanvasScene } from './components/ThreeCanvasScene';
import { LetterModal } from './components/LetterModal';
import { TopBar } from './components/TopBar';
import {
  DEFAULT_GIFT_CONFIG,
  parseGiftConfig,
  getRandomizedGiftConfig,
  GiftConfig
} from './utils/bouquetConfig';

export default function App() {
  const [config, setConfig] = useState<GiftConfig>(() => getRandomizedGiftConfig(DEFAULT_GIFT_CONFIG));
  const [stage, setStage] = useState<'bouquet' | 'scene'>('bouquet');
  const [letterOpen, setLetterOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check URL query parameters for dynamic IDs or autostart
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const autostart = params.get('autostart') === '1';

    // Check for query param like ?fc8e1763db7249b6 or ?id=...
    let websiteId = params.get('id') || '';
    if (!websiteId) {
      const search = window.location.search.replace(/^\?+/, '').trim();
      const firstParam = search.split('&')[0];
      const [key, val] = firstParam.split('=');
      if (key && val === undefined && /^[a-z0-9]{6,64}$/i.test(key)) {
        websiteId = key;
      }
    }

    if (autostart) {
      setStage('scene');
    }

    if (websiteId && websiteId !== 'fc8e1763db7249b6') {
      fetch(`https://apiv2.deargift.online/api/v2/access/photobouquet/${encodeURIComponent(websiteId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.data) {
            setConfig(parseGiftConfig(data.data));
          }
        })
        .catch((err) => {
          console.warn('Using default preset, could not fetch remote config:', err);
        });
    }
  }, []);

  // Initialize and handle background music
  const startMusic = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(config.bgMusic);
      audioRef.current.loop = true;
    }
    audioRef.current
      .play()
      .then(() => {
        setIsMusicPlaying(true);
      })
      .catch((err) => {
        console.warn('Audio play waiting for user interaction:', err);
      });
  }, [config.bgMusic]);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) {
      startMusic();
      return;
    }
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setIsMusicPlaying(true));
    } else {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
  }, [startMusic]);

  // Handle transition from bouquet to scene
  const handleStart = useCallback(() => {
    setStage('scene');
    startMusic();

    // Automatically suggest opening the letter after 4 seconds
    setTimeout(() => {
      setLetterOpen(true);
    }, 4000);
  }, [startMusic]);

  const handleReplayBouquet = useCallback(() => {
    setConfig((prev) => getRandomizedGiftConfig(prev));
    setStage('bouquet');
    setLetterOpen(false);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#1a0515] select-none">
      {/* 1. Bouquet Intro Stage */}
      {stage === 'bouquet' && (
        <BouquetIntro
          onStart={handleStart}
          images={config.bouquetImages}
          cutouts={config.bouquetCutouts}
        />
      )}

      {/* 2. 3D StarField & Rain Scene */}
      {stage === 'scene' && (
        <>
          <ThreeCanvasScene
            texts={config.flyingTexts}
            images={config.flyingImages}
            showHearts={config.flyingHearts}
          />

          <TopBar
            envelope={config.letter.envelope}
            onOpenLetter={() => setLetterOpen(true)}
            isMusicPlaying={isMusicPlaying}
            onToggleMusic={toggleMusic}
            onReplayBouquet={handleReplayBouquet}
          />
        </>
      )}

      {/* 3. Romantic 3D Folded Letter Modal */}
      <LetterModal
        open={letterOpen}
        onClose={() => setLetterOpen(false)}
        letter={config.letter}
      />
    </main>
  );
}
