import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_GIFT_CONFIG,
  BOUQUET_PARTS,
  PHOTO_SLOTS,
  BLOOM_FLOWERS,
  calculatePolygonClip,
  formatLetterText,
  parseGiftConfig,
  getRandomizedGiftConfig
} from './bouquetConfig.ts';

test('DEFAULT_GIFT_CONFIG has correct preset values for fc8e1763db7249b6', () => {
  assert.equal(DEFAULT_GIFT_CONFIG.websiteId, 'fc8e1763db7249b6');
  assert.equal(DEFAULT_GIFT_CONFIG.productType, 'photobouquet');
  assert.equal(DEFAULT_GIFT_CONFIG.bouquetImages.length, 6);
  assert.equal(DEFAULT_GIFT_CONFIG.flyingImages.length, 18);
  assert.equal(DEFAULT_GIFT_CONFIG.flyingTexts.length, 14);
  assert.ok(DEFAULT_GIFT_CONFIG.letter.text.includes('20/10'));
  assert.equal(DEFAULT_GIFT_CONFIG.letter.envelope.headline, '20/10');
  assert.equal(DEFAULT_GIFT_CONFIG.bgMusic, '/music/bay-giua-ngan-ha.mp3');
});

test('BOUQUET_PARTS and PHOTO_SLOTS are properly configured', () => {
  assert.equal(BOUQUET_PARTS.length, 19);
  assert.equal(PHOTO_SLOTS.length, 6);
  assert.equal(BLOOM_FLOWERS.length, 6);
});

test('calculatePolygonClip produces valid polygon string', () => {
  const clip = calculatePolygonClip(PHOTO_SLOTS[0]);
  assert.ok(clip.startsWith('polygon('));
  assert.ok(clip.endsWith(')'));
  assert.ok(clip.includes('%'));
});

test('formatLetterText correctly parses greeting, paragraphs, and signature', () => {
  const parsed = formatLetterText(DEFAULT_GIFT_CONFIG.letter.text);
  assert.equal(parsed.greeting, 'Gửi người xinh xắn nhất trên đời');
  assert.ok(parsed.paragraphs.length >= 1);
});

test('parseGiftConfig safely handles empty and partial objects', () => {
  const emptyParsed = parseGiftConfig(null);
  assert.equal(emptyParsed.websiteId, 'fc8e1763db7249b6');
  assert.equal(emptyParsed.bouquetImages.length, 6);

  const partialParsed = parseGiftConfig({
    websiteId: 'custom-123',
    flyingTexts: ['Hello world']
  });
  assert.equal(partialParsed.websiteId, 'custom-123');
  assert.equal(partialParsed.flyingTexts[0], 'Hello world');
  assert.equal(partialParsed.bouquetImages.length, 6);
});

test('getRandomizedGiftConfig shuffles and selects 6 bouquet images and valid letter photo', () => {
  const config1 = getRandomizedGiftConfig();
  const config2 = getRandomizedGiftConfig();
  assert.equal(config1.bouquetImages.length, 6);
  assert.equal(config1.flyingImages.length, 18);
  assert.ok(config1.letter.photo.startsWith('/photos/anh'));
  assert.ok(config2.letter.photo.startsWith('/photos/anh'));
});
