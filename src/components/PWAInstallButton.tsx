import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Detect standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIOSDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowModal(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  // Do not display if already in standalone app mode
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleShareLink = async () => {
    const url = window.location.href.split('?')[0];
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Món quà 20/10 của em',
          text: 'Một món quà nhỏ bất ngờ dành tặng em ngày 20/10 💖',
          url
        });
      } catch (err) {
        // Ignored if user dismissed share sheet
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      <div className="fixed bottom-3 right-3 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/75 hover:bg-rose-900 border border-rose-400/40 text-rose-100 text-xs font-medium shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          aria-label="Cài đặt ứng dụng vào điện thoại"
          title="Thêm món quà vào màn hình điện thoại"
        >
          <span>📲</span>
          <span>Cài vào điện thoại</span>
        </button>

        <button
          type="button"
          onClick={handleShareLink}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-950/75 hover:bg-rose-900 border border-rose-400/40 text-rose-100 text-xs font-medium shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          aria-label="Chia sẻ quà tặng cho cô ấy"
          title="Sao chép link hoặc gửi trực tiếp cho cô ấy"
        >
          <span>🔗</span>
          <span>{copied ? 'Đã chép link!' : 'Gửi cho nàng'}</span>
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-[#2a0823] border border-rose-500/40 p-5 text-rose-100 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-rose-800/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📱</span>
                <h3 className="font-bold text-base text-rose-200">
                  {isIOS ? 'Thêm vào iPhone / iPad' : 'Thêm vào màn hình chính'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-rose-400 hover:text-white text-xl p-1"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-rose-200/90">
              {isIOS ? (
                <>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-rose-400">1.</span>
                    <span>
                      Nhấn vào nút <strong>Chia sẻ</strong> (biểu tượng hình vuông có mũi tên trỏ lên) ở thanh dưới cùng Safari.
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-rose-400">2.</span>
                    <span>
                      Cuộn xuống và chọn <strong>"Thêm vào Màn hình chính" (Add to Home Screen)</strong>.
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-rose-400">3.</span>
                    <span>
                      Nhấn <strong>Thêm (Add)</strong> ở góc trên bên phải. Món quà sẽ xuất hiện như một ứng dụng riêng trên màn hình của nàng!
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-rose-400">1.</span>
                    <span>
                      Nhấn vào nút menu <strong>(3 dấu chấm)</strong> ở góc trên bên phải trình duyệt Chrome.
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-rose-400">2.</span>
                    <span>
                      Chọn <strong>"Cài đặt ứng dụng"</strong> hoặc <strong>"Thêm vào màn hình chính"</strong>.
                    </span>
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={handleShareLink}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-medium text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {copied ? '✓ Đã chép link quà tặng' : 'Sao chép link gửi nàng'}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="py-2 px-4 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-medium cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
