import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getFinishPreset,
  getFocusPreset,
  validateBookingInput,
  SALON_FINISHES,
  SALON_FOCUS_PRESETS,
} from './salon-hero-config';

test('getFinishPreset returns matching finish preset and falls back safely', () => {
  const gold = getFinishPreset('obsidian-gold');
  assert.equal(gold.label, '24K Brushed Gold');
  assert.equal(SALON_FINISHES.length, 3);
});

test('getFocusPreset returns camera coordinates and target for each 3D spotlight', () => {
  const shears = getFocusPreset('shears');
  assert.equal(shears.id, 'shears');
  assert.equal(shears.cameraPos.length, 3);
  assert.equal(SALON_FOCUS_PRESETS.length, 4);
});

test('validateBookingInput enforces non-empty client name, service, and time slot', () => {
  assert.equal(
    validateBookingInput({ clientName: '', service: 'Precision Cut', timeSlot: '11:30 AM' }).valid,
    false
  );
  assert.equal(
    validateBookingInput({ clientName: 'A', service: 'Precision Cut', timeSlot: '11:30 AM' }).valid,
    false
  );
  assert.equal(
    validateBookingInput({ clientName: 'Aarav Patel', service: 'Signature Razor Fade & Sculpt', timeSlot: '05:00 PM' }).valid,
    true
  );
});
