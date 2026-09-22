/**
 * Validation and normalization utilities for Ghanaian phone numbers and email addresses.
 */

export function normalizeGhanaPhone(raw: string): string {
  if (!raw) return '';
  let cleaned = raw.replace(/[\s\-\(\)\.]/g, '').trim();
  
  if (cleaned.startsWith('+233')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('233') && cleaned.length >= 11) {
    cleaned = '0' + cleaned.slice(3);
  }
  
  // If user entered 9 digits without leading 0 (e.g. 537420120 or 244123456)
  if (cleaned.length === 9 && !cleaned.startsWith('0')) {
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

export function isValidEmail(raw: string): boolean {
  if (!raw) return false;
  const email = raw.trim().toLowerCase();
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}
