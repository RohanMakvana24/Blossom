import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWall,
  HAIRCUT_DESIGNS,
  filterHaircutDesigns,
  createPortraitFallbackDataUri,
} from './haircut-dock-config';

test('HAIRCUT_DESIGNS provides 20 curated unisex haircut design portraits with rich metadata', () => {
  assert.equal(HAIRCUT_DESIGNS.length, 20);
  for (const item of HAIRCUT_DESIGNS) {
    assert.ok(item.id.startsWith('style-'));
    assert.ok(item.name.length > 0);
    assert.ok(item.role.length > 0);
    assert.ok(item.price.startsWith('₹'));
    assert.ok(item.duration.endsWith('Min'));
    assert.ok(item.technique.length > 0);
    assert.ok(item.category === 'men' || item.category === 'women');
    assert.ok(item.cover.startsWith('https://'));
    assert.ok(item.thumb.startsWith('https://'));
  }
});

test('filterHaircutDesigns filters cleanly by men, women, and all', () => {
  const all = filterHaircutDesigns(HAIRCUT_DESIGNS, 'all');
  const men = filterHaircutDesigns(HAIRCUT_DESIGNS, 'men');
  const women = filterHaircutDesigns(HAIRCUT_DESIGNS, 'women');
  assert.equal(all.length, 20);
  assert.equal(men.length, 10);
  assert.equal(women.length, 10);
  assert.ok(men.every((d) => d.category === 'men'));
  assert.ok(women.every((d) => d.category === 'women'));
});

test('buildWall computes grid and leaves a clear hole in the center on desktop and mobile', () => {
  const desktopWall = buildWall(1440, 900, HAIRCUT_DESIGNS.length);
  assert.ok(desktopWall.cols >= 5);
  assert.ok(desktopWall.rows >= 5);
  assert.ok(desktopWall.hole.cols >= 3);
  assert.ok(desktopWall.hole.rows >= 3);

  // Verify no tile sits inside the central hole
  for (const t of desktopWall.tiles) {
    const insideCols =
      t.c >= desktopWall.hole.c0 && t.c < desktopWall.hole.c0 + desktopWall.hole.cols;
    const insideRows =
      t.r >= desktopWall.hole.r0 && t.r < desktopWall.hole.r0 + desktopWall.hole.rows;
    assert.equal(insideCols && insideRows, false);
    assert.ok(t.person >= 0 && t.person < HAIRCUT_DESIGNS.length);
  }

  const mobileWall = buildWall(390, 844, HAIRCUT_DESIGNS.length);
  assert.ok(mobileWall.cols >= 5);
  assert.ok(mobileWall.rows >= 5);
  assert.equal(mobileWall.hole.cols, 3);
});

test('createPortraitFallbackDataUri returns a valid SVG data URI', () => {
  const uri = createPortraitFallbackDataUri('Textured Skin Fade', 'Boys · Master Barber Cut', 0);
  assert.ok(uri.startsWith('data:image/svg+xml;utf8,'));
});

