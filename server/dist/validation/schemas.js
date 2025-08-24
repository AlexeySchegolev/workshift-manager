"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateRequestBody = exports.StatisticsQuerySchema = exports.ShiftPlanQuerySchema = exports.LocationQuerySchema = exports.EmployeeQuerySchema = exports.PaginatedResponseSchema = exports.ApiResponseSchema = exports.PaginationSchema = exports.ConstraintViolationSchema = exports.ValidateShiftPlanSchema = exports.ShiftPlanResponseSchema = exports.ShiftPlanCreateSchema = exports.GenerateShiftPlanSchema = exports.MonthlyShiftPlanSchema = exports.DayShiftPlanSchema = exports.ShiftRulesResponseSchema = exports.ShiftRulesUpdateSchema = exports.ShiftRulesCreateSchema = exports.LocationResponseSchema = exports.LocationUpdateSchema = exports.LocationCreateSchema = exports.TimeSlotSchema = exports.EmployeeResponseSchema = exports.EmployeeUpdateSchema = exports.EmployeeCreateSchema = exports.TimeStringSchema = exports.DateStringSchema = exports.UUIDParamsSchema = exports.UUIDSchema = exports.ConstraintTypeSchema = exports.ConstraintStatusSchema = exports.ClinicSchema = exports.EmployeeRoleSchema = void 0;
const zod_1 = require("zod");
exports.EmployeeRoleSchema = zod_1.z.string().min(1, 'Rolle ist erforderlich').max(50, 'Rolle zu lang');
exports.ClinicSchema = zod_1.z.string().min(1, 'Klinik ist erforderlich').max(100, 'Klinik-Name zu lang').optional();
exports.ConstraintStatusSchema = zod_1.z.enum(['ok', 'warning', 'violation', 'info']);
exports.ConstraintTypeSchema = zod_1.z.enum(['hard', 'soft']);
exports.UUIDSchema = zod_1.z.string().uuid('Ungültige UUID');
exports.UUIDParamsSchema = zod_1.z.object({
    id: exports.UUIDSchema
});
exports.DateStringSchema = zod_1.z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Datum muss im Format DD.MM.YYYY sein');
exports.TimeStringSchema = zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'Zeit muss im Format HH:MM sein');
exports.EmployeeCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name ist erforderlich').max(100, 'Name zu lang'),
    role: exports.EmployeeRoleSchema,
    hoursPerMonth: zod_1.z.number().positive('Monatsstunden müssen positiv sein').max(200, 'Zu viele Monatsstunden'),
    hoursPerWeek: zod_1.z.number().positive('Wochenstunden müssen positiv sein').max(50, 'Zu viele Wochenstunden').optional(),
    clinic: exports.ClinicSchema.optional()
});
exports.EmployeeUpdateSchema = exports.EmployeeCreateSchema.partial();
exports.EmployeeResponseSchema = zod_1.z.object({
    id: exports.UUIDSchema,
    name: zod_1.z.string(),
    role: exports.EmployeeRoleSchema,
    hoursPerMonth: zod_1.z.number(),
    hoursPerWeek: zod_1.z.number().optional(),
    clinic: exports.ClinicSchema.optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
exports.TimeSlotSchema = zod_1.z.object({
    start: exports.TimeStringSchema,
    end: exports.TimeStringSchema
});
exports.LocationCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name ist erforderlich').max(200, 'Name zu lang'),
    address: zod_1.z.string().min(1, 'Adresse ist erforderlich').max(200, 'Adresse zu lang'),
    city: zod_1.z.string().min(1, 'Stadt ist erforderlich').max(100, 'Stadt zu lang'),
    postalCode: zod_1.z.string().min(5, 'PLZ zu kurz').max(10, 'PLZ zu lang'),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email('Ungültige E-Mail-Adresse').optional(),
    manager: zod_1.z.string().max(100, 'Manager-Name zu lang').optional(),
    capacity: zod_1.z.number().int().positive('Kapazität muss positiv sein'),
    operatingHours: zod_1.z.object({
        monday: zod_1.z.array(exports.TimeSlotSchema),
        tuesday: zod_1.z.array(exports.TimeSlotSchema),
        wednesday: zod_1.z.array(exports.TimeSlotSchema),
        thursday: zod_1.z.array(exports.TimeSlotSchema),
        friday: zod_1.z.array(exports.TimeSlotSchema),
        saturday: zod_1.z.array(exports.TimeSlotSchema),
        sunday: zod_1.z.array(exports.TimeSlotSchema)
    }),
    specialties: zod_1.z.array(zod_1.z.string().min(1, 'Spezialisierung darf nicht leer sein')),
    equipment: zod_1.z.array(zod_1.z.string().min(1, 'Ausrüstung darf nicht leer sein')),
    isActive: zod_1.z.boolean().default(true)
});
exports.LocationUpdateSchema = exports.LocationCreateSchema.partial();
exports.LocationResponseSchema = zod_1.z.object({
    id: exports.UUIDSchema,
    name: zod_1.z.string(),
    address: zod_1.z.string(),
    city: zod_1.z.string(),
    postalCode: zod_1.z.string(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    manager: zod_1.z.string().optional(),
    capacity: zod_1.z.number(),
    operatingHours: zod_1.z.object({
        monday: zod_1.z.array(exports.TimeSlotSchema),
        tuesday: zod_1.z.array(exports.TimeSlotSchema),
        wednesday: zod_1.z.array(exports.TimeSlotSchema),
        thursday: zod_1.z.array(exports.TimeSlotSchema),
        friday: zod_1.z.array(exports.TimeSlotSchema),
        saturday: zod_1.z.array(exports.TimeSlotSchema),
        sunday: zod_1.z.array(exports.TimeSlotSchema)
    }),
    specialties: zod_1.z.array(zod_1.z.string()),
    equipment: zod_1.z.array(zod_1.z.string()),
    isActive: zod_1.z.boolean(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
exports.ShiftRulesCreateSchema = zod_1.z.object({
    minNursesPerShift: zod_1.z.number().int().min(1, 'Mindestens 1 Pfleger erforderlich').max(10, 'Zu viele Pfleger'),
    minNurseManagersPerShift: zod_1.z.number().int().min(0, 'Negative Werte nicht erlaubt').max(5, 'Zu viele Schichtleiter'),
    minHelpers: zod_1.z.number().int().min(0, 'Negative Werte nicht erlaubt').max(10, 'Zu viele Helfer'),
    maxSaturdaysPerMonth: zod_1.z.number().int().min(0, 'Negative Werte nicht erlaubt').max(4, 'Zu viele Samstage'),
    maxConsecutiveSameShifts: zod_1.z.number().int().min(0, 'Negative Werte nicht erlaubt').max(7, 'Zu viele aufeinanderfolgende Schichten'),
    weeklyHoursOverflowTolerance: zod_1.z.number().min(0, 'Toleranz muss positiv sein').max(1, 'Toleranz zu hoch')
});
exports.ShiftRulesUpdateSchema = exports.ShiftRulesCreateSchema.partial();
exports.ShiftRulesResponseSchema = zod_1.z.object({
    id: exports.UUIDSchema,
    minNursesPerShift: zod_1.z.number(),
    minNurseManagersPerShift: zod_1.z.number(),
    minHelpers: zod_1.z.number(),
    maxSaturdaysPerMonth: zod_1.z.number(),
    maxConsecutiveSameShifts: zod_1.z.number(),
    weeklyHoursOverflowTolerance: zod_1.z.number(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
exports.DayShiftPlanSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.array(exports.UUIDSchema));
exports.MonthlyShiftPlanSchema = zod_1.z.record(exports.DateStringSchema, exports.DayShiftPlanSchema.nullable());
exports.GenerateShiftPlanSchema = zod_1.z.object({
    year: zod_1.z.number().int().min(2020, 'Jahr zu früh').max(2030, 'Jahr zu spät'),
    month: zod_1.z.number().int().min(1, 'Monat muss zwischen 1 und 12 liegen').max(12, 'Monat muss zwischen 1 und 12 liegen'),
    employeeIds: zod_1.z.array(exports.UUIDSchema).optional(),
    useRelaxedRules: zod_1.z.boolean().default(false)
});
exports.ShiftPlanCreateSchema = zod_1.z.object({
    year: zod_1.z.number().int().min(2020, 'Jahr zu früh').max(2030, 'Jahr zu spät'),
    month: zod_1.z.number().int().min(1, 'Monat muss zwischen 1 und 12 liegen').max(12, 'Monat muss zwischen 1 und 12 liegen'),
    planData: exports.MonthlyShiftPlanSchema,
    employeeAvailability: zod_1.z.record(exports.UUIDSchema, zod_1.z.object({
        weeklyHoursAssigned: zod_1.z.number().min(0),
        totalHoursAssigned: zod_1.z.number().min(0),
        shiftsAssigned: zod_1.z.array(exports.DateStringSchema),
        lastShiftType: zod_1.z.string().nullable(),
        saturdaysWorked: zod_1.z.number().int().min(0)
    })).optional(),
    statistics: zod_1.z.object({
        completeDays: zod_1.z.number().int().min(0),
        incompleteDays: zod_1.z.number().int().min(0),
        completionRate: zod_1.z.number().min(0).max(100),
        averageWorkload: zod_1.z.number().min(0),
        workloadDistribution: zod_1.z.array(zod_1.z.object({
            employeeId: exports.UUIDSchema,
            name: zod_1.z.string(),
            assignedHours: zod_1.z.number().min(0),
            targetHours: zod_1.z.number().min(0),
            percentage: zod_1.z.number().min(0)
        })),
        saturdayDistribution: zod_1.z.array(zod_1.z.object({
            employeeId: exports.UUIDSchema,
            name: zod_1.z.string(),
            count: zod_1.z.number().int().min(0)
        }))
    }).optional()
});
exports.ShiftPlanResponseSchema = zod_1.z.object({
    id: exports.UUIDSchema,
    year: zod_1.z.number(),
    month: zod_1.z.number(),
    planData: exports.MonthlyShiftPlanSchema,
    employeeAvailability: zod_1.z.record(exports.UUIDSchema, zod_1.z.object({
        weeklyHoursAssigned: zod_1.z.number(),
        totalHoursAssigned: zod_1.z.number(),
        shiftsAssigned: zod_1.z.array(exports.DateStringSchema),
        lastShiftType: zod_1.z.string().nullable(),
        saturdaysWorked: zod_1.z.number()
    })).optional(),
    statistics: zod_1.z.object({
        completeDays: zod_1.z.number(),
        incompleteDays: zod_1.z.number(),
        completionRate: zod_1.z.number(),
        averageWorkload: zod_1.z.number(),
        workloadDistribution: zod_1.z.array(zod_1.z.object({
            employeeId: exports.UUIDSchema,
            name: zod_1.z.string(),
            assignedHours: zod_1.z.number(),
            targetHours: zod_1.z.number(),
            percentage: zod_1.z.number()
        })),
        saturdayDistribution: zod_1.z.array(zod_1.z.object({
            employeeId: exports.UUIDSchema,
            name: zod_1.z.string(),
            count: zod_1.z.number()
        }))
    }).optional(),
    isFinalized: zod_1.z.boolean(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
exports.ValidateShiftPlanSchema = zod_1.z.object({
    shiftPlan: exports.MonthlyShiftPlanSchema,
    employeeIds: zod_1.z.array(exports.UUIDSchema),
    year: zod_1.z.number().int().min(2020).max(2030),
    month: zod_1.z.number().int().min(1).max(12)
});
exports.ConstraintViolationSchema = zod_1.z.object({
    id: exports.UUIDSchema,
    shiftPlanId: exports.UUIDSchema,
    type: exports.ConstraintTypeSchema,
    rule: zod_1.z.string().min(1, 'Regel ist erforderlich'),
    message: zod_1.z.string().min(1, 'Nachricht ist erforderlich'),
    employeeId: exports.UUIDSchema.optional(),
    date: exports.DateStringSchema.optional(),
    severity: zod_1.z.number().int().min(1).max(3).default(1),
    isResolved: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date()
});
exports.PaginationSchema = zod_1.z.object({
    page: zod_1.z.number().int().min(1, 'Seite muss mindestens 1 sein').default(1),
    limit: zod_1.z.number().int().min(1, 'Limit muss mindestens 1 sein').max(100, 'Limit zu hoch').default(20),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('asc')
});
const ApiResponseSchema = (dataSchema) => zod_1.z.object({
    success: zod_1.z.boolean(),
    data: dataSchema.optional(),
    error: zod_1.z.string().optional(),
    message: zod_1.z.string().optional()
});
exports.ApiResponseSchema = ApiResponseSchema;
const PaginatedResponseSchema = (dataSchema) => zod_1.z.object({
    data: zod_1.z.array(dataSchema),
    pagination: zod_1.z.object({
        page: zod_1.z.number(),
        limit: zod_1.z.number(),
        total: zod_1.z.number(),
        totalPages: zod_1.z.number()
    })
});
exports.PaginatedResponseSchema = PaginatedResponseSchema;
exports.EmployeeQuerySchema = zod_1.z.object({
    role: exports.EmployeeRoleSchema.optional(),
    clinic: exports.ClinicSchema.optional(),
    isActive: zod_1.z.boolean().optional(),
    ...exports.PaginationSchema.shape
});
exports.LocationQuerySchema = zod_1.z.object({
    city: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
    ...exports.PaginationSchema.shape
});
exports.ShiftPlanQuerySchema = zod_1.z.object({
    year: zod_1.z.number().int().optional(),
    month: zod_1.z.number().int().optional(),
    isFinalized: zod_1.z.boolean().optional(),
    ...exports.PaginationSchema.shape
});
exports.StatisticsQuerySchema = zod_1.z.object({
    year: zod_1.z.number().int().min(2020).max(2030),
    month: zod_1.z.number().int().min(1).max(12).optional(),
    employeeId: exports.UUIDSchema.optional(),
    locationId: exports.UUIDSchema.optional()
});
const validateRequestBody = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.body);
            req.validatedBody = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
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
exports.validateRequestBody = validateRequestBody;
const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            const validatedQuery = schema.parse(req.query);
            req.validatedQuery = validatedQuery;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
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
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            const validatedParams = schema.parse(req.params);
            req.validatedParams = validatedParams;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
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
exports.validateParams = validateParams;
//# sourceMappingURL=schemas.js.map