import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getDestinationImageRecord,
  getVerifiedImageUrl,
  buildExactImageSearchQuery,
  DESTINATION_IMAGE_REGISTRY,
} from '../destinationImageService';

test('Destination Images: Brihadisvara Temple maps to exact verified photo', () => {
  const byId = getDestinationImageRecord('p1');
  assert.ok(byId, 'Should resolve p1');
  assert.equal(byId?.name, 'Brihadisvara Temple');
  assert.equal(byId?.district, 'Thanjavur');
  assert.ok(byId?.imageUrl.includes('photo-1582510003544-4d00b7f74220'));
  assert.equal(byId?.verified, true);

  const byName = getDestinationImageRecord({ name: 'Brihadisvara Temple, Thanjavur' });
  assert.ok(byName, 'Should resolve by name');
  assert.equal(byName?.id, 'p1');
});

test('Destination Images: Core user-specified landmark examples map accurately', () => {
  const meenakshi = getDestinationImageRecord('meenakshi');
  assert.ok(meenakshi);
  assert.equal(meenakshi.name, 'Meenakshi Amman Temple');
  assert.equal(meenakshi.district, 'Madurai');

  const dhanushkodi = getDestinationImageRecord({ name: 'Dhanushkodi, Rameswaram' });
  assert.ok(dhanushkodi);
  assert.equal(dhanushkodi.name, 'Dhanushkodi');

  const kodaikanal = getDestinationImageRecord({ name: 'Kodaikanal Lake' });
  assert.ok(kodaikanal);
  assert.equal(kodaikanal.name, 'Kodaikanal Lake');

  const hogenakkal = getDestinationImageRecord({ name: 'Hogenakkal Falls' });
  assert.ok(hogenakkal);
  assert.equal(hogenakkal.name, 'Hogenakkal Falls');

  const vivekananda = getDestinationImageRecord({ name: 'Vivekananda Rock Memorial, Kanyakumari' });
  assert.ok(vivekananda);
  assert.equal(vivekananda.name, 'Vivekananda Rock Memorial');

  const marudamalai = getDestinationImageRecord({ name: 'Marudamalai Temple, Coimbatore' });
  assert.ok(marudamalai);
  assert.equal(marudamalai.name, 'Marudamalai Temple');
});

test('Destination Images: Unknown/unverified destination never falls back to generic images', () => {
  const unknown = getDestinationImageRecord({ name: 'Random Nonexistent Shrine', district: 'Unknown' });
  assert.equal(unknown, null, 'Unverified places must return null rather than generic images');

  const unknownUrl = getVerifiedImageUrl({ name: 'Random Nonexistent Shrine' });
  assert.equal(unknownUrl, '', 'Should return empty string so UI renders "Image unavailable" placeholder');
});

test('Destination Images: External search query builds exact name + location', () => {
  const query1 = buildExactImageSearchQuery('Brihadisvara Temple', 'Thanjavur');
  assert.equal(query1, 'Brihadisvara Temple Thanjavur Tamil Nadu');

  const query2 = buildExactImageSearchQuery('Meenakshi Amman Temple', 'Madurai');
  assert.equal(query2, 'Meenakshi Amman Temple Madurai Tamil Nadu');

  const query3 = buildExactImageSearchQuery('Dhanushkodi', 'Rameswaram');
  assert.equal(query3, 'Dhanushkodi Rameswaram Tamil Nadu');
});
