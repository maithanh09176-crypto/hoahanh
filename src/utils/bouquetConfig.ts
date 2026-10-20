export interface BouquetPart {
  asset: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  z: number;
  kind: 'back' | 'foliage' | 'infill' | 'flower' | 'front' | 'butterfly' | 'bow';
  revealDelay?: number;
  flip?: boolean;
}

export interface PhotoSlot {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  z: number;
}

export interface EnvelopeConfig {
  topLine: string;
  headline: string;
  bottomLine: string;
}

export interface LetterConfig {
  text: string;
  photo: string;
  envelope: EnvelopeConfig;
}

export interface GiftConfig {
  websiteId: string;
  productType: string;
  configVersion: number;
  enableRain: boolean;
  enableLetter: boolean;
  bouquetImages: string[];
  bouquetCutouts: boolean[];
  flyingTexts: string[];
  flyingImages: string[];
  letter: LetterConfig;
  bgMusic: string;
  palette: string;
  flyingHearts: boolean;
  showWatermark: boolean;
}

export const ASSET_BASE = "https://i.dlove.vn/assets/bouquet-intro/";
export const LETTER_ASSET_BASE = "https://i.dlove.vn/assets/letter-20-10/";

export const ALL_USER_PHOTOS = [
  "/photos/anh1.jpg",
  "/photos/anh2.jpg",
  "/photos/anh3.jpg",
  "/photos/anh4.jpg",
  "/photos/anh5.jpg",
  "/photos/anh6.jpg",
  "/photos/anh7.jpg",
  "/photos/anh8.jpg",
  "/photos/anh9.jpg",
  "/photos/anh10.jpg",
  "/photos/anh11.jpg",
  "/photos/anh12.jpg",
  "/photos/anh13.jpg",
  "/photos/anh14.jpg",
  "/photos/anh16.jpg",
  "/photos/anh17.jpg",
  "/photos/anh18.jpg",
  "/photos/anh19.jpg"
];

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const DEFAULT_GIFT_CONFIG: GiftConfig = {
  websiteId: "fc8e1763db7249b6",
  productType: "photobouquet",
  configVersion: 1,
  enableRain: true,
  enableLetter: true,
  bouquetImages: [
    "/photos/anh1.jpg",
    "/photos/anh18.jpg",
    "/photos/anh3.jpg",
    "/photos/anh16.jpg",
    "/photos/anh5.jpg",
    "/photos/anh6.jpg"
  ],
  bouquetCutouts: [false, false, false, false, false, false],
  flyingTexts: [
    "Luôn vui vẻ và hạnh phúc",
    "Chúc em luôn xinh đẹp",
    "Thêm yêu đời",
    "Được chiều như công chứa",
    "20/10",
    "Thương em",
    "Chúc em thật nhiều may mắn",
    "Ngập tràn yêu thương",
    "Rực rỡ như hoa",
    "Yêu đời, yêu mình",
    "Chẳng lo, chẳng nghĩ",
    "Xinh gái và giàu có",
    "Niền vui mỗi ngày",
    "Ngày càng xinh xắn"
  ],
  flyingImages: [
    "/photos/anh1.jpg",
    "/photos/anh2.jpg",
    "/photos/anh3.jpg",
    "/photos/anh4.jpg",
    "/photos/anh5.jpg",
    "/photos/anh6.jpg",
    "/photos/anh7.jpg",
    "/photos/anh8.jpg",
    "/photos/anh9.jpg",
    "/photos/anh10.jpg",
    "/photos/anh11.jpg",
    "/photos/anh12.jpg",
    "/photos/anh13.jpg",
    "/photos/anh14.jpg",
    "/photos/anh16.jpg",
    "/photos/anh17.jpg",
    "/photos/anh18.jpg",
    "/photos/anh19.jpg"
  ],
  letter: {
    text: "Gửi người xinh xắn nhất trên đời \n\n 20/10 rồi, anh chẳng biết nói những lời hoa mỹ gì nhiều. Chỉ mong em luôn vui vẻ, bình an và hạnh phúc. Mong em luôn rực rỡ như hoa, gặp nhiều may mắn và được yêu thương thật nhiều.\n\n Gặp được em đã là niềm vui lớn của anh rồi, nên anh chỉ muốn những ngày tới em sẽ luôn hạnh phúc.\n\n Chúc em một ngày 20/10 thật vui. Mong mọi dịu dàng của thế giới đều dành cho em.❤️",
    photo: "/photos/anh1.jpg",
    envelope: {
      topLine: "Tặng em",
      headline: "20/10",
      bottomLine: "Một chút yêu thương"
    }
  },
  bgMusic: "/music/bay-giua-ngan-ha.mp3",
  palette: "hongdon",
  flyingHearts: true,
  showWatermark: false
};

export function getRandomizedGiftConfig(base: GiftConfig = DEFAULT_GIFT_CONFIG): GiftConfig {
  const shuffled = shuffleArray(ALL_USER_PHOTOS);
  const bouquet = shuffled.slice(0, 6);
  const letterPhoto = shuffled[0];
  const flying = shuffleArray(ALL_USER_PHOTOS);

  return {
    ...base,
    bouquetImages: bouquet,
    flyingImages: flying,
    letter: {
      ...base.letter,
      photo: letterPhoto
    }
  };
}

export const BOUQUET_PARTS: BouquetPart[] = [
  { asset: "wrap-back-v2", x: 82, y: 125, width: 836, height: 1115, rotate: 0, z: 5, kind: "back" },
  { asset: "leaf-sprig", x: 48, y: 258, width: 310, height: 490, rotate: -26, z: 7, kind: "foliage" },
  { asset: "leaf-sprig", x: 658, y: 274, width: 300, height: 470, rotate: 24, z: 7, kind: "foliage", flip: true },
  { asset: "baby-breath", x: 96, y: 207, width: 246, height: 485, rotate: -13, z: 8, kind: "foliage" },
  { asset: "baby-breath", x: 658, y: 229, width: 246, height: 465, rotate: 15, z: 8, kind: "foliage", flip: true },
  { asset: "baby-breath", x: 330, y: 250, width: 175, height: 345, rotate: -10, z: 9, kind: "infill", revealDelay: 750 },
  { asset: "baby-breath", x: 523, y: 246, width: 202, height: 357, rotate: 15, z: 9, kind: "infill", revealDelay: 950, flip: true },
  { asset: "baby-breath", x: 435, y: 548, width: 210, height: 310, rotate: -5, z: 9, kind: "infill", revealDelay: 1350 },
  { asset: "rose-pink", x: 327, y: 429, width: 125, height: 140, rotate: -8, z: 10, kind: "infill", revealDelay: 900 },
  { asset: "rose-pink", x: 558, y: 463, width: 116, height: 128, rotate: 16, z: 10, kind: "infill", revealDelay: 1100, flip: true },
  { asset: "rose-pink", x: 145, y: 555, width: 236, height: 247, rotate: -17, z: 30, kind: "flower" },
  { asset: "rose-pink", x: 619, y: 548, width: 230, height: 241, rotate: 22, z: 30, kind: "flower" },
  { asset: "baby-breath", x: 155, y: 570, width: 180, height: 260, rotate: -15, z: 31, kind: "flower" },
  { asset: "rose-pink", x: 259, y: 661, width: 205, height: 220, rotate: -9, z: 32, kind: "flower" },
  { asset: "rose-ivory", x: 576, y: 664, width: 196, height: 202, rotate: 13, z: 32, kind: "flower" },
  { asset: "baby-breath", x: 432, y: 683, width: 136, height: 198, rotate: 4, z: 43, kind: "flower" },
  { asset: "wrap-front-v2", x: 60, y: 525, width: 880, height: 550, rotate: 0, z: 40, kind: "front" },
  { asset: "butterfly", x: 70, y: 150, width: 80, height: 75, rotate: -17, z: 48, kind: "butterfly" },
  { asset: "butterfly", x: 861, y: 257, width: 77, height: 72, rotate: 16, z: 48, kind: "butterfly", flip: true }
];

export const PHOTO_SLOTS: PhotoSlot[] = [
  { x: 374, y: 386, width: 252, height: 394, rotate: -1, z: 26 },
  { x: 176, y: 176, width: 240, height: 382, rotate: -6, z: 14 },
  { x: 584, y: 176, width: 240, height: 382, rotate: 6, z: 15 },
  { x: 378, y: 120, width: 244, height: 392, rotate: 0, z: 11 },
  { x: 139, y: 368, width: 240, height: 386, rotate: -8, z: 22 },
  { x: 621, y: 359, width: 240, height: 386, rotate: 8, z: 22 }
];

// Cover flowers that bloom away to reveal the photos
export const BLOOM_FLOWERS = [
  { asset: "rose-pink", x: 296, y: 357, width: 350, height: 350, rotate: -3, z: 27 },
  { asset: "rose-ivory", x: 144, y: 238, width: 310, height: 310, rotate: -14, z: 15 },
  { asset: "rose-pink", x: 574, y: 220, width: 310, height: 310, rotate: 12, z: 16, flip: true },
  { asset: "rose-pink", x: 294, y: 132, width: 326, height: 326, rotate: -4, z: 12 },
  { asset: "rose-pink", x: 107, y: 397, width: 310, height: 310, rotate: -13, z: 23 },
  { asset: "rose-ivory", x: 591, y: 397, width: 298, height: 307, rotate: 13, z: 23 }
];

const CLIP_POINTS = [
  [0, 0],
  [1000, 0],
  [1000, 650],
  [850, 720],
  [700, 780],
  [500, 870],
  [300, 780],
  [150, 720],
  [0, 650]
];

export function calculatePolygonClip(slot: PhotoSlot): string {
  const rad = -((slot.rotate || 0) * Math.PI) / 180;
  const halfW = slot.width * 0.5;
  const halfH = slot.height * 0.78;

  const points = CLIP_POINTS.map(([px, py]) => {
    const ox = px - slot.x - halfW;
    const oy = py - slot.y - halfH;
    const rx = (ox * Math.cos(rad) - oy * Math.sin(rad) + halfW) / slot.width * 100;
    const ry = (ox * Math.sin(rad) + oy * Math.cos(rad) + halfH) / slot.height * 100;
    return `${rx.toFixed(3)}% ${ry.toFixed(3)}%`;
  });

  return `polygon(${points.join(', ')})`;
}

export function formatLetterText(text: string): {
  greeting: string;
  paragraphs: string[];
  signature: string;
} {
  const clean = text.trim();
  if (!clean) {
    return {
      greeting: "Gửi cô gái bé nhỏ của anh",
      paragraphs: ["Chúc em ngày 20/10 luôn tràn ngập niềm vui và hạnh phúc."],
      signature: "Yêu em rất nhiều."
    };
  }

  const lines = clean.split(/\r?\n+/).map(l => l.trim()).filter(Boolean);
  let greeting = "";
  let signature = "";
  let paragraphs = lines;

  if (lines.length > 0 && /^(gửi|thân gửi|kính gửi|to:?|dear)/i.test(lines[0])) {
    greeting = lines[0];
    paragraphs = lines.slice(1);
  }

  if (paragraphs.length > 0) {
    const last = paragraphs[paragraphs.length - 1];
    if (/(yêu em|thương em|mãi yêu|ký tên|from:?|chúc em|anh yêu)/i.test(last) && last.length < 50) {
      signature = last;
      paragraphs = paragraphs.slice(0, -1);
    }
  }

  return { greeting, paragraphs, signature };
}

export function parseGiftConfig(raw: any): GiftConfig {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_GIFT_CONFIG;
  }

  return {
    websiteId: String(raw.websiteId || DEFAULT_GIFT_CONFIG.websiteId),
    productType: String(raw.productType || "photobouquet"),
    configVersion: Number(raw.configVersion) || 1,
    enableRain: raw.enableRain !== false,
    enableLetter: raw.enableLetter !== false,
    bouquetImages: Array.isArray(raw.bouquetImages) && raw.bouquetImages.length > 0
      ? raw.bouquetImages
      : DEFAULT_GIFT_CONFIG.bouquetImages,
    bouquetCutouts: Array.isArray(raw.bouquetCutouts) && raw.bouquetCutouts.length > 0
      ? raw.bouquetCutouts
      : DEFAULT_GIFT_CONFIG.bouquetCutouts,
    flyingTexts: Array.isArray(raw.flyingTexts) && raw.flyingTexts.length > 0
      ? raw.flyingTexts
      : DEFAULT_GIFT_CONFIG.flyingTexts,
    flyingImages: Array.isArray(raw.flyingImages) && raw.flyingImages.length > 0
      ? raw.flyingImages
      : DEFAULT_GIFT_CONFIG.flyingImages,
    letter: {
      text: raw.letter?.text || DEFAULT_GIFT_CONFIG.letter.text,
      photo: raw.letter?.photo || DEFAULT_GIFT_CONFIG.letter.photo,
      envelope: {
        topLine: raw.letter?.envelope?.topLine || DEFAULT_GIFT_CONFIG.letter.envelope.topLine,
        headline: raw.letter?.envelope?.headline || DEFAULT_GIFT_CONFIG.letter.envelope.headline,
        bottomLine: raw.letter?.envelope?.bottomLine || DEFAULT_GIFT_CONFIG.letter.envelope.bottomLine,
      }
    },
    bgMusic: raw.bgMusic || DEFAULT_GIFT_CONFIG.bgMusic,
    palette: raw.palette || "hongdon",
    flyingHearts: raw.flyingHearts !== false,
    showWatermark: !!raw.showWatermark
  };
}
