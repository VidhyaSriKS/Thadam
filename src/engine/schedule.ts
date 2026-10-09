import { EngineConfig } from './types';
import { TransportMode } from '../types/preferences';

// Straight-line distance (Haversine)
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Travel time = straight-line distance x 1.3, divided by speed for transport mode
export function computeTravelMinutes(
  distanceKm: number,
  transport: TransportMode,
  cfg: EngineConfig
): number {
  const roadDistanceKm = distanceKm * 1.3;
  const speed = cfg.transportSpeedsKmH[transport] || 40;
  const hours = roadDistanceKm / speed;
  return Math.max(10, Math.round(hours * 60));
}

// Generate time slot strings starting at 09:00 with lunch slot
export function getStopSlot(
  orderIndex: number,
  durationMinutes: number
): { startTime: string; endTime: string } {
  // Slots:
  // 0 -> 09:00 AM - 11:30 AM
  // 1 -> 11:45 AM - 01:15 PM
  // Lunch slot: 01:15 PM - 02:30 PM
  // 2 -> 02:45 PM - 05:00 PM
  // 3 -> 05:15 PM - 07:15 PM
  switch (orderIndex) {
    case 0:
      return { startTime: '09:00 AM', endTime: '11:30 AM' };
    case 1:
      return { startTime: '11:45 AM', endTime: '01:15 PM' };
    case 2:
      return { startTime: '02:45 PM', endTime: '05:00 PM' };
    case 3:
      return { startTime: '05:15 PM', endTime: '07:15 PM' };
    default:
      return { startTime: '07:30 PM', endTime: '09:00 PM' };
  }
}

// Calculate calendar days between two ISO date strings (inclusive, minimum 1)
export function calculateDaysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 1;
  const [y1, m1, d1] = startDate.split('-').map(Number);
  const [y2, m2, d2] = endDate.split('-').map(Number);
  if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return 1;
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  if (utc2 < utc1) return 1;
  return Math.max(1, Math.min(14, Math.round((utc2 - utc1) / 864e5) + 1));
}

// Add calendar days to an ISO date string (YYYY-MM-DD)
export function addDaysToIso(isoDate: string, daysToAdd: number): string {
  const [y, m, d] = (isoDate || '2026-10-15').split('-').map(Number);
  const dt = new Date(Date.UTC(y || 2026, (m || 10) - 1, (d || 15) + daysToAdd));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dt.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

