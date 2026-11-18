import assert from 'node:assert/strict';
import { nextHeroSlide, activeHeroSlides } from '../lib/hero-slides';
for (const slides of [activeHeroSlides(), activeHeroSlides().slice(0, 2), activeHeroSlides().slice(0, 1)]) {
 let history = 'invalid..offroad.offroad.old';
 const seen: string[] = [];
 for (let i = 0; i < 100; i++) {
  const result = nextHeroSlide(history, slides);
  assert.ok(slides.some(s => s.id === result.slide.id));
  if (slides.length > 1) assert.ok(!seen.slice(-(slides.length - 1)).includes(result.slide.id));
  seen.push(result.slide.id); history = result.history;
 }
}
assert.ok(nextHeroSlide('', []).slide);
console.log('Hero rotation: 1/2/3-photo pools, malformed history and empty-registry fallback passed.');
