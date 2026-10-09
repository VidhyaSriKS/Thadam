import { Destination } from '../types/database';
import { DESTINATIONS } from './destinations';
import rawTnDestinations from './tn_destinations_114.json';

export const TN_114_DESTINATIONS: Destination[] = rawTnDestinations as Destination[];

export const ALL_DESTINATIONS: Destination[] = [
  ...DESTINATIONS,
  ...TN_114_DESTINATIONS.filter(
    (td) => !DESTINATIONS.some((d) => d.name.toLowerCase() === td.name.toLowerCase())
  ),
];

export function getDestinationsForDistrict(district?: string): Destination[] {
  if (!district) return ALL_DESTINATIONS;
  const target = district.trim().toLowerCase();
  if (!target || target.includes('let thadam choose') || target === 'all') {
    return ALL_DESTINATIONS;
  }

  const matches = ALL_DESTINATIONS.filter((d) => {
    const dist = d.district.toLowerCase();
    return dist === target || dist.includes(target) || target.includes(dist);
  });

  return matches.length > 0 ? matches : ALL_DESTINATIONS;
}
