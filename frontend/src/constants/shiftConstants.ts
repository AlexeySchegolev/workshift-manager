import { CreateShiftDto } from '@/api/data-contracts';

// Extract types from the DTO for type safety
type ShiftType = CreateShiftDto['type'];
type ShiftStatus = CreateShiftDto['status'];
type ShiftPriority = CreateShiftDto['priority'];

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

// Shift Statuses with German labels
export const SHIFT_STATUSES: Array<{ value: ShiftStatus; label: string }> = [
  { value: 'draft', label: 'Entwurf' },
  { value: 'published', label: 'Veröffentlicht' },
  { value: 'active', label: 'Aktiv' },
  { value: 'completed', label: 'Abgeschlossen' },
  { value: 'cancelled', label: 'Abgesagt' },
];

// Shift Priorities with German labels
export const SHIFT_PRIORITIES: Array<{ value: ShiftPriority; label: string }> = [
  { value: 1, label: 'Niedrig' },
  { value: 2, label: 'Normal' },
  { value: 3, label: 'Hoch' },
  { value: 4, label: 'Kritisch' },
  { value: 5, label: 'Notfall' },
];

// Recurrence Patterns with German labels
// Note: Backend doesn't define enum for this, so using common patterns
export const RECURRENCE_PATTERNS: Array<{ value: string; label: string }> = [
  { value: 'daily', label: 'Täglich' },
  { value: 'weekly', label: 'Wöchentlich' },
  { value: 'monthly', label: 'Monatlich' },
];