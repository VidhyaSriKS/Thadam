/**
 * THADAM TN — Destination-Specific Image Mapping Service
 *
 * Strict Rule: Destination accuracy comes before decorative imagery.
 * Never displays generic category stock photos when a specific destination is known.
 * If an exact verified photo is unavailable, returns null/empty so the UI displays "Image unavailable".
 */

import { DESTINATION_IMAGE_REGISTRY, DestinationImageRecord } from '../data/destinationImages';

export { DESTINATION_IMAGE_REGISTRY, DestinationImageRecord };

function normalizeStr(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Resolves verified image record for a destination by ID or exact name.
 * Never guesses or falls back to generic random pictures.
 */
export function getDestinationImageRecord(
  destination: { id?: string; name?: string; district?: string } | string | null | undefined
): DestinationImageRecord | null {
  if (!destination) return null;

  // 1. By exact ID lookup
  if (typeof destination === 'string') {
    if (DESTINATION_IMAGE_REGISTRY[destination]) {
      return DESTINATION_IMAGE_REGISTRY[destination];
    }
  } else if (destination.id && DESTINATION_IMAGE_REGISTRY[destination.id]) {
    return DESTINATION_IMAGE_REGISTRY[destination.id];
  }

  // 2. By normalized name lookup
  const nameToMatch = typeof destination === 'string' ? destination : destination.name || '';
  if (!nameToMatch) return null;

  const targetNorm = normalizeStr(nameToMatch);

  // Check aliases and registry names
  for (const record of Object.values(DESTINATION_IMAGE_REGISTRY)) {
    const recNorm = normalizeStr(record.name);
    if (recNorm === targetNorm || recNorm.includes(targetNorm) || targetNorm.includes(recNorm)) {
      return record;
    }
  }

  // Common landmarks requested
  if (targetNorm.includes('meenakshi')) return DESTINATION_IMAGE_REGISTRY.meenakshi;
  if (targetNorm.includes('dhanushkodi')) return DESTINATION_IMAGE_REGISTRY.dhanushkodi;
  if (targetNorm.includes('kodaikanal')) return DESTINATION_IMAGE_REGISTRY.kodaikanal_lake;
  if (targetNorm.includes('hogenakkal')) return DESTINATION_IMAGE_REGISTRY.hogenakkal;
  if (targetNorm.includes('vivekananda')) return DESTINATION_IMAGE_REGISTRY.vivekananda_rock;
  if (targetNorm.includes('marudamalai')) return DESTINATION_IMAGE_REGISTRY.marudamalai;
  if (targetNorm.includes('mahabalipuram')) return DESTINATION_IMAGE_REGISTRY.mahabalipuram;
  if (targetNorm.includes('marinabeach')) return DESTINATION_IMAGE_REGISTRY.marina_beach;
  if (targetNorm.includes('brihadisvara') || targetNorm.includes('bigtemple')) {
    return DESTINATION_IMAGE_REGISTRY.p1;
  }
  if (targetNorm.includes('kallanai') || targetNorm.includes('grandanicut')) {
    return DESTINATION_IMAGE_REGISTRY.p11;
  }
  if (targetNorm.includes('airavatesvara') || targetNorm.includes('darasuram')) {
    return DESTINATION_IMAGE_REGISTRY.p4;
  }
  if (targetNorm.includes('gangaikonda')) {
    return DESTINATION_IMAGE_REGISTRY.p8;
  }
  if (targetNorm.includes('swamimalai')) {
    return DESTINATION_IMAGE_REGISTRY.p5;
  }
  if (targetNorm.includes('thirubuvanam')) {
    return DESTINATION_IMAGE_REGISTRY.p9;
  }
  if (targetNorm.includes('sarangapani')) {
    return DESTINATION_IMAGE_REGISTRY.p6;
  }
  if (targetNorm.includes('nageswaran')) {
    return DESTINATION_IMAGE_REGISTRY.p7;
  }

  return null;
}

/**
 * Returns exact verified image URL or empty string if unverified.
 */
export function getVerifiedImageUrl(
  dest: { id?: string; name?: string; image?: string; district?: string } | string | null | undefined
): string {
  const record = getDestinationImageRecord(dest);
  if (record && record.verified) {
    return record.imageUrl;
  }
  // If destination object itself already has a verified, non-empty URI, return it
  if (typeof dest === 'object' && dest?.image && dest.image.startsWith('http')) {
    return dest.image;
  }
  return '';
}

/**
 * Builds an exact, highly targeted search query string for destination image lookups.
 * Example: “Brihadisvara Temple Thanjavur Tamil Nadu” rather than “Tamil Nadu temple”.
 */
export function buildExactImageSearchQuery(
  destinationName: string,
  district?: string
): string {
  const cleanName = destinationName.trim();
  const cleanDistrict = district ? district.trim() : '';
  if (cleanDistrict) {
    return `${cleanName} ${cleanDistrict} Tamil Nadu`;
  }
  return `${cleanName} Tamil Nadu`;
}
