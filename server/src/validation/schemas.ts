import { z } from 'zod';

/**
 * Zod-Validierungsschemas für die API
 * Generelle Schemas ohne spezifische Einschränkungen für maximale Flexibilität
 */

// Basis-Schemas - flexibel und erweiterbar
export const EmployeeRoleSchema = z.string().min(1, 'Rolle ist erforderlich').max(50, 'Rolle zu lang');
export const ClinicSchema = z.string().min(1, 'Klinik ist erforderlich').max(100, 'Klinik-Name zu lang').optional();
export const ConstraintStatusSchema = z.enum(['ok', 'warning', 'violation', 'info']);
export const ConstraintTypeSchema = z.enum(['hard', 'soft']);

// UUID-Schema
export const UUIDSchema = z.string().uuid('Ungültige UUID');

// UUID-Parameter-Schema für Routen
export const UUIDParamsSchema = z.object({
  id: UUIDSchema
});

// Datum-Schemas
export const DateStringSchema = z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Datum muss im Format DD.MM.YYYY sein');
export const TimeStringSchema = z.string().regex(/^\d{2}:\d{2}$/, 'Zeit muss im Format HH:MM sein');

// Mitarbeiter-Schemas
export const EmployeeCreateSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(100, 'Name zu lang'),
  role: EmployeeRoleSchema,
  hoursPerMonth: z.number().positive('Monatsstunden müssen positiv sein').max(200, 'Zu viele Monatsstunden'),
  hoursPerWeek: z.number().positive('Wochenstunden müssen positiv sein').max(50, 'Zu viele Wochenstunden').optional(),
  locationId: z.number().int().positive('Location ID muss eine positive Zahl sein').optional()
});

export const EmployeeUpdateSchema = EmployeeCreateSchema.partial();

export const EmployeeResponseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  role: EmployeeRoleSchema,
  hoursPerMonth: z.number(),
  hoursPerWeek: z.number().optional(),
  locationId: z.number().int().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Zeitslot-Schema
export const TimeSlotSchema = z.object({
  start: TimeStringSchema,
  end: TimeStringSchema
});

// Standort-Schemas
export const LocationCreateSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(200, 'Name zu lang'),
  address: z.string().min(1, 'Adresse ist erforderlich').max(200, 'Adresse zu lang'),
  city: z.string().min(1, 'Stadt ist erforderlich').max(100, 'Stadt zu lang'),
  postalCode: z.string().min(5, 'PLZ zu kurz').max(10, 'PLZ zu lang'),
  phone: z.string().optional(),
  email: z.string().email('Ungültige E-Mail-Adresse').optional(),
  manager: z.string().max(100, 'Manager-Name zu lang').optional(),
  capacity: z.number().int().positive('Kapazität muss positiv sein'),
  operatingHours: z.object({
    monday: z.array(TimeSlotSchema),
    tuesday: z.array(TimeSlotSchema),
    wednesday: z.array(TimeSlotSchema),
    thursday: z.array(TimeSlotSchema),
    friday: z.array(TimeSlotSchema),
    saturday: z.array(TimeSlotSchema),
    sunday: z.array(TimeSlotSchema)
  }),
  specialties: z.array(z.string().min(1, 'Spezialisierung darf nicht leer sein')),
  equipment: z.array(z.string().min(1, 'Ausrüstung darf nicht leer sein')),
  isActive: z.boolean().default(true)
});

export const LocationUpdateSchema = LocationCreateSchema.partial();

export const LocationResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  postalCode: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  manager: z.string().optional(),
  capacity: z.number(),
  operatingHours: z.object({
    monday: z.array(TimeSlotSchema),
    tuesday: z.array(TimeSlotSchema),
    wednesday: z.array(TimeSlotSchema),
    thursday: z.array(TimeSlotSchema),
    friday: z.array(TimeSlotSchema),
    saturday: z.array(TimeSlotSchema),
    sunday: z.array(TimeSlotSchema)
  }),
  specialties: z.array(z.string()),
  equipment: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Schichtregeln-Schemas
export const ShiftRulesCreateSchema = z.object({
  minNursesPerShift: z.number().int().min(1, 'Mindestens 1 Pfleger erforderlich').max(10, 'Zu viele Pfleger'),
  minNurseManagersPerShift: z.number().int().min(0, 'Negative Werte nicht erlaubt').max(5, 'Zu viele Schichtleiter'),
  minHelpers: z.number().int().min(0, 'Negative Werte nicht erlaubt').max(10, 'Zu viele Helfer'),
  maxSaturdaysPerMonth: z.number().int().min(0, 'Negative Werte nicht erlaubt').max(4, 'Zu viele Samstage'),
  maxConsecutiveSameShifts: z.number().int().min(0, 'Negative Werte nicht erlaubt').max(7, 'Zu viele aufeinanderfolgende Schichten'),
  weeklyHoursOverflowTolerance: z.number().min(0, 'Toleranz muss positiv sein').max(1, 'Toleranz zu hoch')
});

export const ShiftRulesUpdateSchema = ShiftRulesCreateSchema.partial();

export const ShiftRulesResponseSchema = z.object({
  id: UUIDSchema,
  minNursesPerShift: z.number(),
  minNurseManagersPerShift: z.number(),
  minHelpers: z.number(),
  maxSaturdaysPerMonth: z.number(),
  maxConsecutiveSameShifts: z.number(),
  weeklyHoursOverflowTolerance: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Schichtplan-Schemas
export const DayShiftPlanSchema = z.record(z.string(), z.array(UUIDSchema));
export const MonthlyShiftPlanSchema = z.record(DateStringSchema, DayShiftPlanSchema.nullable());

export const GenerateShiftPlanSchema = z.object({
  year: z.number().int().min(2020, 'Jahr zu früh').max(2030, 'Jahr zu spät'),
  month: z.number().int().min(1, 'Monat muss zwischen 1 und 12 liegen').max(12, 'Monat muss zwischen 1 und 12 liegen'),
  employeeIds: z.array(UUIDSchema).optional(),
  useRelaxedRules: z.boolean().default(false)
});

export const ShiftPlanCreateSchema = z.object({
  year: z.number().int().min(2020, 'Jahr zu früh').max(2030, 'Jahr zu spät'),
  month: z.number().int().min(1, 'Monat muss zwischen 1 und 12 liegen').max(12, 'Monat muss zwischen 1 und 12 liegen'),
  planData: MonthlyShiftPlanSchema,
  employeeAvailability: z.record(UUIDSchema, z.object({
    weeklyHoursAssigned: z.number().min(0),
    totalHoursAssigned: z.number().min(0),
    shiftsAssigned: z.array(DateStringSchema),
    lastShiftType: z.string().nullable(),
    saturdaysWorked: z.number().int().min(0)
  })).optional(),
  statistics: z.object({
    completeDays: z.number().int().min(0),
    incompleteDays: z.number().int().min(0),
    completionRate: z.number().min(0).max(100),
    averageWorkload: z.number().min(0),
    workloadDistribution: z.array(z.object({
      employeeId: UUIDSchema,
      name: z.string(),
      assignedHours: z.number().min(0),
      targetHours: z.number().min(0),
      percentage: z.number().min(0)
    })),
    saturdayDistribution: z.array(z.object({
      employeeId: UUIDSchema,
      name: z.string(),
      count: z.number().int().min(0)
    }))
  }).optional()
});

export const ShiftPlanResponseSchema = z.object({
  id: UUIDSchema,
  year: z.number(),
  month: z.number(),
  planData: MonthlyShiftPlanSchema,
  employeeAvailability: z.record(UUIDSchema, z.object({
    weeklyHoursAssigned: z.number(),
    totalHoursAssigned: z.number(),
    shiftsAssigned: z.array(DateStringSchema),
    lastShiftType: z.string().nullable(),
    saturdaysWorked: z.number()
  })).optional(),
  statistics: z.object({
    completeDays: z.number(),
    incompleteDays: z.number(),
    completionRate: z.number(),
    averageWorkload: z.number(),
    workloadDistribution: z.array(z.object({
      employeeId: UUIDSchema,
      name: z.string(),
      assignedHours: z.number(),
      targetHours: z.number(),
      percentage: z.number()
    })),
    saturdayDistribution: z.array(z.object({
      employeeId: UUIDSchema,
      name: z.string(),
      count: z.number()
    }))
  }).optional(),
  isFinalized: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Validierung-Schemas
export const ValidateShiftPlanSchema = z.object({
  shiftPlan: MonthlyShiftPlanSchema,
  employeeIds: z.array(UUIDSchema),
  year: z.number().int().min(2020).max(2030),
  month: z.number().int().min(1).max(12)
});

// Constraint-Violation-Schemas
export const ConstraintViolationSchema = z.object({
  id: UUIDSchema,
  shiftPlanId: UUIDSchema,
  type: ConstraintTypeSchema,
  rule: z.string().min(1, 'Regel ist erforderlich'),
  message: z.string().min(1, 'Nachricht ist erforderlich'),
  employeeId: UUIDSchema.optional(),
  date: DateStringSchema.optional(),
  severity: z.number().int().min(1).max(3).default(1),
  isResolved: z.boolean().default(false),
  createdAt: z.date()
});

// Paginierung-Schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1, 'Seite muss mindestens 1 sein').default(1),
  limit: z.coerce.number().int().min(1, 'Limit muss mindestens 1 sein').max(100, 'Limit zu hoch').default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
});

// API-Response-Schemas
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional()
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  data: z.array(dataSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number()
  })
});

// Query-Parameter-Schemas
export const EmployeeQuerySchema = z.object({
  role: EmployeeRoleSchema.optional(),
  location: z.coerce.number().int().optional(),
  isActive: z.coerce.boolean().optional(),
  ...PaginationSchema.shape
});

export const LocationQuerySchema = z.object({
  city: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  ...PaginationSchema.shape
});

export const ShiftPlanQuerySchema = z.object({
  year: z.coerce.number().int().optional(),
  month: z.coerce.number().int().optional(),
  isFinalized: z.coerce.boolean().optional(),
  ...PaginationSchema.shape
});

// Statistik-Schemas
export const StatisticsQuerySchema = z.object({
  year: z.number().int().min(2020).max(2030),
  month: z.number().int().min(1).max(12).optional(),
  employeeId: UUIDSchema.optional(),
  locationId: z.number().int().optional()
});

/**
 * Hilfsfunktion zur Validierung von Request-Bodies
 */
export const validateRequestBody = <T>(schema: z.ZodSchema<T>) => {
  return (req: any, res: any, next: any) => {
    try {
      const validatedData = schema.parse(req.body);
      req.validatedBody = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validierungsfehler',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

/**
 * Hilfsfunktion zur Validierung von Query-Parametern
 */
export const validateQuery = <T>(schema: z.ZodSchema<T>) => {
  return (req: any, res: any, next: any) => {
    try {
      const validatedQuery = schema.parse(req.query);
      req.validatedQuery = validatedQuery;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Query-Parameter-Validierungsfehler',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

/**
 * Hilfsfunktion zur Validierung von URL-Parametern
 */
export const validateParams = <T>(schema: z.ZodSchema<T>) => {
  return (req: any, res: any, next: any) => {
    try {
      const validatedParams = schema.parse(req.params);
      req.validatedParams = validatedParams;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'URL-Parameter-Validierungsfehler',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};