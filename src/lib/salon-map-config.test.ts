import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  RAJKOT_STUDIO_INFO,
  AFFORDABLE_PRICE_MENU,
  MAP_FLY_CHAPTERS,
  getActiveChapterOnScroll,
  interpolateCameraState,
  projectLngLatToViewport,
} from './salon-map-config';

test('RAJKOT_STUDIO_INFO contains exact Fitness 5 gym Kotecha Circle Rajkot address and phone', () => {
  assert.equal(
    RAJKOT_STUDIO_INFO.fullAddress,
    'Fitness 5 gym, Kotecha Cir, Jala Ram Nagar, Rajkot, Gujarat 360007'
  );
  assert.equal(RAJKOT_STUDIO_INFO.phoneDisplay, '096380 55173');
  assert.ok(RAJKOT_STUDIO_INFO.googleMapsUrl.includes('Fitness+5+gym'));
  assert.equal(RAJKOT_STUDIO_INFO.coordinates.length, 2);
});

test('MAP_FLY_CHAPTERS defines 4 progressive scroll-fly-to camera chapters into Rajkot studio', () => {
  assert.equal(MAP_FLY_CHAPTERS.length, 4);
  assert.ok(MAP_FLY_CHAPTERS[0].camera.zoom < MAP_FLY_CHAPTERS[3].camera.zoom);
  assert.deepEqual(
    MAP_FLY_CHAPTERS[3].camera.center,
    RAJKOT_STUDIO_INFO.coordinates
  );
});

test('AFFORDABLE_PRICE_MENU provides pocket-friendly salon services with rupee pricing', () => {
  assert.ok(AFFORDABLE_PRICE_MENU.length >= 6);
  for (const item of AFFORDABLE_PRICE_MENU) {
    assert.ok(item.price.startsWith('₹'));
    assert.ok(item.service.length > 0);
  }
});

test('getActiveChapterOnScroll selects the chapter crossing the viewport trigger line', () => {
  const bounds = [
    { id: 'rajkot-overview', top: -500, bottom: -100 },
    { id: 'kotecha-circle', top: -80, bottom: 260 },
    { id: 'jalaram-nagar-gym', top: 280, bottom: 640 },
    { id: 'blossom-rajkot-studio', top: 660, bottom: 980 },
  ];
  const active = getActiveChapterOnScroll(800, bounds);
  assert.equal(active, 'jalaram-nagar-gym');
});

test('interpolateCameraState smoothly interpolates center, zoom, pitch, and bearing', () => {
  const start = MAP_FLY_CHAPTERS[0].camera;
  const end = MAP_FLY_CHAPTERS[3].camera;
  const mid = interpolateCameraState(start, end, 0.5);
  assert.ok(mid.zoom > start.zoom && mid.zoom < end.zoom);
  assert.ok(mid.pitch > start.pitch && mid.pitch < end.pitch);
  const full = interpolateCameraState(start, end, 1);
  assert.deepEqual(full.center, end.center);
  assert.equal(full.zoom, end.zoom);
});

test('projectLngLatToViewport maps camera center directly to viewport center', () => {
  const cam = MAP_FLY_CHAPTERS[1].camera;
  const pt = projectLngLatToViewport(cam.center, cam, 800, 600);
  assert.equal(Math.round(pt.x), 400);
  assert.equal(Math.round(pt.y), 300);
});
