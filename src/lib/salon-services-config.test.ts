import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  UNISEX_SERVICES,
  UNISEX_SERVICE_ITEMS,
  DEPTH_KX,
  DEPTH_KH,
  DEPTH_KO,
  wrapMod,
  computeModelDepth,
  interpolateDepthTable,
  computeRailCardOffset,
} from './salon-services-config';

test('UNISEX_SERVICES contains all 8 signature salon product lines in exact order', () => {
  assert.equal(UNISEX_SERVICES.length, 8);
  const titles = UNISEX_SERVICES.map((s) => s.title);
  assert.deepEqual(titles, [
    'Moroccan Argan Gold Elixir',
    'Keratin & Peptide Silk Masque',
    'Volcanic Matte Styling Clay',
    '24K Hydra-Glow Glass Serum',
    'Bond-Repair Violet Shampoo',
    'Soie De Rose Hair Parfüm',
    'Royal Oud Beard & Groom Oil',
    'Ayurvedic Bhringraj Scalp Tonic',
  ]);
  assert.equal(UNISEX_SERVICE_ITEMS.length, 16);
});

test('wrapMod and computeModelDepth map look positions into [-1, N-1] range', () => {
  assert.equal(wrapMod(-1, 8), 7);
  assert.equal(wrapMod(8, 8), 0);
  assert.equal(computeModelDepth(0, 0, 8), 0);
  const exitingDepth = computeModelDepth(0, 0.2, 8);
  assert.ok(Math.abs(exitingDepth - -0.2) < 1e-6);
});

test('interpolateDepthTable interpolates stops from d=-1 to d=5 accurately', () => {
  assert.equal(interpolateDepthTable(-1, DEPTH_KX), 1.2);
  assert.equal(interpolateDepthTable(0, DEPTH_KX), 0.744);
  assert.equal(interpolateDepthTable(0, DEPTH_KH), 0.832);
  assert.equal(interpolateDepthTable(5, DEPTH_KO), 0);
});

test('computeRailCardOffset wraps 16 cards in sync with 2 cards per product look', () => {
  const offset0 = computeRailCardOffset(0, 0, 240, 16);
  assert.equal(offset0, 0);
  const offsetAfterOneLook = computeRailCardOffset(2, 1, 240, 16);
  assert.equal(offsetAfterOneLook, 0);
});
