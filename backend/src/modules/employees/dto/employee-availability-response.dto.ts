import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AvailabilityType, AvailabilityStatus, AbsenceReason, RecurrencePattern, TimeSlotAvailability, WeeklyAvailability } from '../../../database/entities/employee-availability.entity';

export class EmployeeAvailabilityResponseDto {
  @ApiProperty({
    description: 'Eindeutige ID des Verfügbarkeitsdatensatzes',
    example: 'uuid-string'
  })
  id: string;

  @ApiProperty({
    description: 'ID des Mitarbeiters',
    example: 'uuid-string'
  })
  employeeId: string;

  @ApiProperty({
    description: 'Art der Verfügbarkeit',
    enum: AvailabilityType,
    example: AvailabilityType.AVAILABLE
  })
  type: AvailabilityType;

  @ApiProperty({
    description: 'Status der Verfügbarkeit',
    enum: AvailabilityStatus,
    example: AvailabilityStatus.ACTIVE
  })
  status: AvailabilityStatus;

  @ApiProperty({
    description: 'Startdatum des Verfügbarkeitszeitraums',
    type: 'string',
    format: 'date',
    example: '2024-01-15'
  })
  startDate: Date;

  @ApiPropertyOptional({
    description: 'Enddatum des Verfügbarkeitszeitraums',
    type: 'string',
    format: 'date',
    example: '2024-01-20'
  })
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Startzeit für teilweise Tagesverfügbarkeit (HH:MM)',
    example: '09:00'
  })
  startTime?: string;

  @ApiPropertyOptional({
    description: 'Endzeit für teilweise Tagesverfügbarkeit (HH:MM)',
    example: '17:00'
  })
  endTime?: string;

  @ApiProperty({
    description: 'Ganztägige Verfügbarkeit',
    example: true
  })
  isAllDay: boolean;

  @ApiProperty({
    description: 'Wiederkehrende Verfügbarkeit',
    example: false
  })
  isRecurring: boolean;

  @ApiProperty({
    description: 'Wiederholungsmuster',
    enum: RecurrencePattern,
    example: RecurrencePattern.NONE
  })
  recurrencePattern: RecurrencePattern;

  @ApiProperty({
    description: 'Wiederholungsintervall (z.B. alle 2 Wochen)',
    example: 1
  })
  recurrenceInterval: number;

  @ApiProperty({
    description: 'Wiederholungstage (0=Sonntag, 1=Montag, usw.)',
    type: [Number],
    example: [1, 2, 3, 4, 5]
  })
  recurrenceDays: number[];

  @ApiPropertyOptional({
    description: 'Enddatum der Wiederholung',
    type: 'string',
    format: 'date',
    example: '2024-12-31'
  })
  recurrenceEndDate?: Date;

  @ApiPropertyOptional({
    description: 'Grund für Abwesenheit',
    enum: AbsenceReason,
    example: AbsenceReason.VACATION
  })
  absenceReason?: AbsenceReason;

  @ApiPropertyOptional({
    description: 'Detaillierte Begründung',
    example: 'Arzttermin am Vormittag'
  })
  reasonDescription?: string;

  @ApiPropertyOptional({
    description: 'Wöchentliche Verfügbarkeitszeiten',
    type: 'object',
    additionalProperties: true
  })
  weeklyAvailability?: WeeklyAvailability;

  @ApiPropertyOptional({
    description: 'Maximale Stunden pro Tag',
    example: 8.0
  })
  maxHoursPerDay?: number;

  @ApiPropertyOptional({
    description: 'Maximale Stunden pro Woche',
    example: 40.0
  })
  maxHoursPerWeek?: number;

  @ApiProperty({
    description: 'Bevorzugte Schichtarten',
    type: [String],
    example: ['F', 'S']
  })
  preferredShiftTypes: string[];

  @ApiProperty({
    description: 'Ausgeschlossene Schichtarten',
    type: [String],
    example: ['N']
  })
  excludedShiftTypes: string[];

  @ApiProperty({
    description: 'Bevorzugte Standorte',
    type: [String],
    example: ['location-uuid-1', 'location-uuid-2']
  })
  preferredLocations: string[];

  @ApiProperty({
    description: 'Ausgeschlossene Standorte',
    type: [String],
    example: ['location-uuid-3']
  })
  excludedLocations: string[];

  @ApiProperty({
    description: 'Prioritätsstufe (1-5, höher = wichtiger)',
    example: 1
  })
  priorityLevel: number;

  @ApiProperty({
    description: 'Benötigt Genehmigung',
    example: false
  })
  requiresApproval: boolean;

  @ApiPropertyOptional({
    description: 'Genehmigt von (Benutzer-ID)',
    example: 'user-uuid'
  })
  approvedBy?: string;

  @ApiPropertyOptional({
    description: 'Genehmigungsdatum',
    type: 'string',
    format: 'date-time',
    example: '2024-01-15T10:30:00Z'
  })
  approvedAt?: Date;

  @ApiPropertyOptional({
    description: 'Abgelehnt von (Benutzer-ID)',
    example: 'user-uuid'
  })
  rejectedBy?: string;

  @ApiPropertyOptional({
    description: 'Ablehnungsdatum',
    type: 'string',
    format: 'date-time',
    example: '2024-01-15T10:30:00Z'
  })
  rejectedAt?: Date;

  @ApiPropertyOptional({
    description: 'Ablehnungsgrund',
    example: 'Personalbesetzung bereits ausreichend'
  })
  rejectionReason?: string;

  @ApiPropertyOptional({
    description: 'Einreichungsdatum',
    type: 'string',
    format: 'date-time',
    example: '2024-01-15T09:00:00Z'
  })
  submittedAt?: Date;

  @ApiProperty({
    description: 'Notfall',
    example: false
  })
  isEmergency: boolean;

  @ApiProperty({
    description: 'Betrifft Lohnabrechnung',
    example: false
  })
  affectsPayroll: boolean;

  @ApiProperty({
    description: 'Dokumentation erforderlich',
    example: false
  })
  documentationRequired: boolean;

  @ApiProperty({
    description: 'Dokumentation bereitgestellt',
    example: false
  })
  documentationProvided: boolean;

  @ApiProperty({
    description: 'Angehängte Dokumente (URLs oder IDs)',
    type: [String],
    example: []
  })
  attachedDocuments: string[];

  @ApiPropertyOptional({
    description: 'Notizen',
    example: 'Zusätzliche Informationen'
  })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Interne Notizen (nur für Manager sichtbar)',
    example: 'Interne Bemerkungen'
  })
  internalNotes?: string;

  @ApiProperty({
    description: 'Benachrichtigung gesendet',
    example: false
  })
  notificationSent: boolean;

  @ApiProperty({
    description: 'Erinnerung gesendet',
    example: false
  })
  reminderSent: boolean;

  @ApiProperty({
    description: 'Ist aktiv',
    example: true
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Erstellt von (Benutzer-ID)',
    example: 'user-uuid'
  })
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Geändert von (Benutzer-ID)',
    example: 'user-uuid'
  })
  updatedBy?: string;

  @ApiProperty({
    description: 'Erstellungsdatum',
    type: 'string',
    format: 'date-time',
    example: '2024-01-01T00:00:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Letztes Änderungsdatum',
    type: 'string',
    format: 'date-time',
    example: '2024-01-15T10:30:00Z'
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Löschzeitpunkt (Soft Delete)',
    type: 'string',
    format: 'date-time',
    example: '2023-12-31T23:59:59Z'
  })
  deletedAt?: Date;

  // Computed properties
  @ApiProperty({
    description: 'Ist momentan aktiv',
    example: true
  })
  isCurrentlyActive: boolean;

  @ApiProperty({
    description: 'Dauer in Tagen',
    example: 5
  })
  duration: number;

  @ApiProperty({
    description: 'Ist abgelaufen',
    example: false
  })
  isExpired: boolean;

  @ApiProperty({
    description: 'Wartet auf Genehmigung',
    example: false
  })
  isPending: boolean;

  @ApiProperty({
    description: 'Benötigt Genehmigung',
    example: false
  })
  needsApproval: boolean;

  @ApiProperty({
    description: 'Ist Abwesenheit',
    example: false
  })
  isAbsence: boolean;

  @ApiProperty({
    description: 'Anzeigename für Grund',
    example: 'Verfügbar'
  })
  displayReason: string;

  @ApiProperty({
    description: 'Zeitbereich als Text',
    example: '09:00 - 17:00'
  })
  timeRange: string;

  @ApiProperty({
    description: 'Datumsbereich als Text',
    example: '15.01.2024 - 20.01.2024'
  })
  dateRange: string;
}