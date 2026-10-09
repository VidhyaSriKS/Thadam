import assert from 'node:assert/strict';
import test from 'node:test';
import { DESTINATIONS } from '../../data/destinations';
import { EXPERIENCES } from '../../data/experiences';
import { DEFAULT_PREFERENCES } from '../../types/preferences';
import { DEFAULT_ENGINE_CONFIG } from '../config';
import { explainStop } from '../explain';
import { replaceStop } from '../replace';
import { generateTrip } from '../generate';
import { scoreDestinationFactors } from '../score';
import { translationsEn } from '../../i18n/translationsEn';
import { translationsTa } from '../../i18n/translationsTa';

test('Bilingual: 100% key parity between English and Tamil dictionaries', () => {
  const enKeys = Object.keys(translationsEn);
  const taKeys = Object.keys(translationsTa);

  assert.equal(
    enKeys.length,
    taKeys.length,
    `Key count mismatch: English has ${enKeys.length}, Tamil has ${taKeys.length}`
  );

  for (const key of enKeys) {
    const enVal = (translationsEn as Record<string, string>)[key];
    const taVal = (translationsTa as Record<string, string>)[key];
    assert.ok(taVal && taVal.trim().length > 0, `Missing Tamil translation for key: ${key}`);
    assert.ok(enVal && enVal.trim().length > 0, `Missing English translation for key: ${key}`);
  }
});

test('Bilingual: explainStop generates natural Tamil AI explanation when language is Tamil', () => {
  const dest = DESTINATIONS[0];
  const factors = scoreDestinationFactors(dest, DEFAULT_PREFERENCES, EXPERIENCES, DEFAULT_ENGINE_CONFIG);

  const tamilReasons = explainStop(
    dest,
    { ...DEFAULT_PREFERENCES, language: 'Tamil' },
    factors,
    EXPERIENCES[0],
    'ta'
  );

  assert.ok(tamilReasons.length >= 3, 'Tamil explanation should yield at least 3 reasons');
  // Confirm presence of Tamil Unicode characters
  const hasTamil = tamilReasons.some((r) => /[\u0B80-\u0BFF]/.test(r));
  assert.ok(hasTamil, 'AI explanation reasons should contain Tamil Unicode text');
});

test('Bilingual: replaceStop produces localized reasons for alternatives', () => {
  const data = { destinations: DESTINATIONS, experiences: EXPERIENCES };
  const { trip } = generateTrip(DEFAULT_PREFERENCES, data, DEFAULT_ENGINE_CONFIG);
  const targetStopId = trip.days[0].stops[0].id;

  const altsTa = replaceStop(
    trip,
    targetStopId,
    'Too crowded',
    data,
    DEFAULT_ENGINE_CONFIG,
    true
  );

  assert.ok(altsTa.length > 0, 'Should find alternatives');
  assert.ok(
    altsTa[0].reasons.length > 0,
    'Alternative should have non-empty localized reason'
  );
  // Verify Tamil characters in replacement explanation
  const hasTamil = altsTa.some((alt) => alt.reasons.some((r) => /[\u0B80-\u0BFF]/.test(r)));
  assert.ok(hasTamil, 'Alternative reason should be translated to Tamil');
});
