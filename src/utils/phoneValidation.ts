/**
 * Validation and normalization utilities for Ghanaian phone numbers and email addresses.
 */

export function normalizeGhanaPhone(raw: string): string {
  if (!raw) return '';
  let cleaned = raw.replace(/[\s\-\(\)\.\+]/g, '').trim();
  
  // If starts with 233
  if (cleaned.startsWith('233')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.length === 9 && !cleaned.startsWith('0')) {
    // If user omitted leading 0 (e.g. 537420120)
    cleaned = '0' + cleaned;
  }
  
  return cleaned;
}

export function isValidGhanaPhone(raw: string): boolean {
  if (!raw) return false;
  const normalized = normalizeGhanaPhone(raw);
  // Standard Ghana mobile prefix: 02x, 05x, or 03x followed by 7-8 digits (total 9-10 digits)
  return /^0[235][0-9]{7,8}$/.test(normalized);
}

export function normalizeEmail(raw: string): string {
  if (!raw) return '';
  return raw.trim().toLowerCase();
}

export function isValidEmail(raw: string): boolean {
  if (!raw) return false;
  const email = normalizeEmail(raw);
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

