import { CreateShiftDto } from '@/api/data-contracts';

// Extract types from the DTO for type safety
type ShiftType = CreateShiftDto['type'];

// Shift Types with German labels
export const SHIFT_TYPES: Array<{ value: ShiftType; label: string }> = [
  { value: 'morning', label: 'Frühschicht' },
  { value: 'afternoon', label: 'Spätschicht' },
  { value: 'evening', label: 'Abendschicht' },
  { value: 'night', label: 'Nachtschicht' },
  { value: 'full_day', label: 'Ganztag' },
  { value: 'split', label: 'Geteilte Schicht' },
  { value: 'on_call', label: 'Bereitschaft' },
  { value: 'overtime', label: 'Überstunden' },
];


// Recurrence Patterns with German labels
// Note: Backend doesn't define enum for this, so using common patterns
export const RECURRENCE_PATTERNS: Array<{ value: string; label: string }> = [
  { value: 'daily', label: 'Täglich' },
  { value: 'weekly', label: 'Wöchentlich' },
  { value: 'monthly', label: 'Monatlich' },
];