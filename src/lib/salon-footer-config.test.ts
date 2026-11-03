import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FOOTER_COLUMNS,
  SALON_BRANCHES,
  validateVipRequest,
  getBranchById,
} from './salon-footer-config';

test('FOOTER_COLUMNS and SALON_BRANCHES provide clean Rajkot & Vadodara studio data and navigation', () => {
  assert.equal(FOOTER_COLUMNS.length, 3);
  assert.equal(SALON_BRANCHES.length, 3);
  assert.equal(SALON_BRANCHES[0].city, 'Rajkot');
  assert.equal(SALON_BRANCHES[0].phone, '096380 55173');
  for (const col of FOOTER_COLUMNS) {
    assert.equal(col.links.length, 4);
  }
});

test('validateVipRequest validates email addresses and 10-digit phone numbers', () => {
  assert.equal(validateVipRequest('   ').valid, false);
  assert.equal(validateVipRequest('invalid-input').valid, false);
  assert.equal(validateVipRequest('client@zacksalon.in').valid, true);
  assert.equal(validateVipRequest('+91 98765 43210').valid, true);
});

test('getBranchById returns matching branch or falls back to Rajkot Kotecha Circle studio', () => {
  assert.equal(getBranchById('bhayli-prive').area, 'Sevasi · Bhayli');
  assert.equal(getBranchById('unknown').id, 'rajkot-kotecha');
});
