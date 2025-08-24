import { z } from 'zod';
export declare const EmployeeRoleSchema: z.ZodString;
export declare const ClinicSchema: z.ZodOptional<z.ZodString>;
export declare const ConstraintStatusSchema: z.ZodEnum<["ok", "warning", "violation", "info"]>;
export declare const ConstraintTypeSchema: z.ZodEnum<["hard", "soft"]>;
export declare const UUIDSchema: z.ZodString;
export declare const DateStringSchema: z.ZodString;
export declare const TimeStringSchema: z.ZodString;
export declare const EmployeeCreateSchema: z.ZodObject<{
    name: z.ZodString;
    role: z.ZodString;
    hoursPerMonth: z.ZodNumber;
    hoursPerWeek: z.ZodOptional<z.ZodNumber>;
    clinic: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    role: string;
    hoursPerMonth: number;
    hoursPerWeek?: number | undefined;
    clinic?: string | undefined;
}, {
    name: string;
    role: string;
    hoursPerMonth: number;
    hoursPerWeek?: number | undefined;
    clinic?: string | undefined;
}>;
export declare const EmployeeUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodString>;
    hoursPerMonth: z.ZodOptional<z.ZodNumber>;
    hoursPerWeek: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    clinic: z.ZodOptional<z.ZodOptional<z.ZodOptional<z.ZodString>>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    role?: string | undefined;
    hoursPerMonth?: number | undefined;
    hoursPerWeek?: number | undefined;
    clinic?: string | undefined;
}, {
    name?: string | undefined;
    role?: string | undefined;
    hoursPerMonth?: number | undefined;
    hoursPerWeek?: number | undefined;
    clinic?: string | undefined;
}>;
export declare const EmployeeResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    role: z.ZodString;
    hoursPerMonth: z.ZodNumber;
    hoursPerWeek: z.ZodOptional<z.ZodNumber>;
    clinic: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    role: string;
    hoursPerMonth: number;
    createdAt: Date;
    updatedAt: Date;
    hoursPerWeek?: number | undefined;
    clinic?: string | undefined;
}, {
    id: string;
    name: string;
    role: string;
    hoursPerMonth: number;
    createdAt: Date;
    updatedAt: Date;
    hoursPerWeek?: number | undefined;
    clinic?: string | undefined;
}>;
export declare const TimeSlotSchema: z.ZodObject<{
    start: z.ZodString;
    end: z.ZodString;
}, "strip", z.ZodTypeAny, {
    start: string;
    end: string;
}, {
    start: string;
    end: string;
}>;
export declare const LocationCreateSchema: z.ZodObject<{
    name: z.ZodString;
    address: z.ZodString;
    city: z.ZodString;
    postalCode: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    manager: z.ZodOptional<z.ZodString>;
    capacity: z.ZodNumber;
    operatingHours: z.ZodObject<{
        monday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        tuesday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        wednesday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        thursday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        friday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        saturday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        sunday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        monday: {
            start: string;
            end: string;
        }[];
        tuesday: {
            start: string;
            end: string;
        }[];
        wednesday: {
            start: string;
            end: string;
        }[];
        thursday: {
            start: string;
            end: string;
        }[];
        friday: {
            start: string;
            end: string;
        }[];
        saturday: {
            start: string;
            end: string;
        }[];
        sunday: {
            start: string;
            end: string;
        }[];
    }, {
        monday: {
            start: string;
            end: string;
        }[];
        tuesday: {
            start: string;
            end: string;
        }[];
        wednesday: {
            start: string;
            end: string;
        }[];
        thursday: {
            start: string;
            end: string;
        }[];
        friday: {
            start: string;
            end: string;
        }[];
        saturday: {
            start: string;
            end: string;
        }[];
        sunday: {
            start: string;
            end: string;
        }[];
    }>;
    specialties: z.ZodArray<z.ZodString, "many">;
    equipment: z.ZodArray<z.ZodString, "many">;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    capacity: number;
    operatingHours: {
        monday: {
            start: string;
            end: string;
        }[];
        tuesday: {
            start: string;
            end: string;
        }[];
        wednesday: {
            start: string;
            end: string;
        }[];
        thursday: {
            start: string;
            end: string;
        }[];
        friday: {
            start: string;
            end: string;
        }[];
        saturday: {
            start: string;
            end: string;
        }[];
        sunday: {
            start: string;
            end: string;
        }[];
    };
    equipment: string[];
    isActive: boolean;
    specialties: string[];
    phone?: string | undefined;
    email?: string | undefined;
    manager?: string | undefined;
}, {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    capacity: number;
    operatingHours: {
        monday: {
            start: string;
            end: string;
        }[];
        tuesday: {
            start: string;
            end: string;
        }[];
        wednesday: {
            start: string;
            end: string;
        }[];
        thursday: {
            start: string;
            end: string;
        }[];
        friday: {
            start: string;
            end: string;
        }[];
        saturday: {
            start: string;
            end: string;
        }[];
        sunday: {
            start: string;
            end: string;
        }[];
    };
    equipment: string[];
    specialties: string[];
    phone?: string | undefined;
    email?: string | undefined;
    manager?: string | undefined;
    isActive?: boolean | undefined;
}>;
export declare const LocationUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    postalCode: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    manager: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    capacity: z.ZodOptional<z.ZodNumber>;
    operatingHours: z.ZodOptional<z.ZodObject<{
        monday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        tuesday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        wednesday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        thursday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        friday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        saturday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        sunday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        monday: {
            start: string;
            end: string;
        }[];
        tuesday: {
            start: string;
            end: string;
        }[];
        wednesday: {
            start: string;
            end: string;
        }[];
        thursday: {
            start: string;
            end: string;
        }[];
        friday: {
            start: string;
            end: string;
        }[];
        saturday: {
            start: string;
            end: string;
        }[];
        sunday: {
            start: string;
            end: string;
        }[];
    }, {
        monday: {
            start: string;
            end: string;
        }[];
        tuesday: {
            start: string;
            end: string;
        }[];
        wednesday: {
            start: string;
            end: string;
        }[];
        thursday: {
            start: string;
            end: string;
        }[];
        friday: {
            start: string;
            end: string;
        }[];
        saturday: {
            start: string;
            end: string;
        }[];
        sunday: {
            start: string;
            end: string;
        }[];
    }>>;
    specialties: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    equipment: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    postalCode?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    manager?: string | undefined;
    capacity?: number | undefined;
    operatingHours?: {
        monday: {
            start: string;
            end: string;
        }[];
        tuesday: {
            start: string;
            end: string;
        }[];
        wednesday: {
            start: string;
            end: string;
        }[];
        thursday: {
            start: string;
            end: string;
        }[];
        friday: {
            start: string;
            end: string;
        }[];
        saturday: {
            start: string;
            end: string;
        }[];
        sunday: {
            start: string;
            end: string;
        }[];
    } | undefined;
    equipment?: string[] | undefined;
    isActive?: boolean | undefined;
    specialties?: string[] | undefined;
}, {
    name?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    postalCode?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    manager?: string | undefined;
    capacity?: number | undefined;
    operatingHours?: {
        monday: {
            start: string;
            end: string;
        }[];
        tuesday: {
            start: string;
            end: string;
        }[];
        wednesday: {
            start: string;
            end: string;
        }[];
        thursday: {
            start: string;
            end: string;
        }[];
        friday: {
            start: string;
            end: string;
        }[];
        saturday: {
            start: string;
            end: string;
        }[];
        sunday: {
            start: string;
            end: string;
        }[];
    } | undefined;
    equipment?: string[] | undefined;
    isActive?: boolean | undefined;
    specialties?: string[] | undefined;
}>;
export declare const LocationResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    address: z.ZodString;
    city: z.ZodString;
    postalCode: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    manager: z.ZodOptional<z.ZodString>;
    capacity: z.ZodNumber;
    operatingHours: z.ZodObject<{
        monday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        tuesday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        wednesday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        thursday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        friday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        saturday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
        sunday: z.ZodArray<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            start: string;
            end: string;
        }, {
            start: string;
            end: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        monday: {
            start: string;
            end: string;
        }[];
        tuesday: {
            start: string;
            end: string;
        }[];
        wednesday: {
            start: string;
            end: string;
        }[];
        thursday: {
            start: string;
            end: string;
        }[];
        friday: {
            start: string;
            end: string;
        }[];
        saturday: {
            start: string;
            end: string;
        }[];
        sunday: {
            start: string;
            end: string;
        }[];
    }, {
        monday: {
            start: string;
            end: string;
        }[];
        tuesday: {
            start: string;
            end: string;
        }[];
        wednesday: {
            start: string;
            end: string;
        }[];
        thursday: {
            start: string;
            end: string;
        }[];
        friday: {
            start: string;
            end: string;
        }[];
        saturday: {
            start: string;
            end: string;
        }[];
        sunday: {
            start: string;
            end: string;
        }[];
    }>;
    specialties: z.ZodArray<z.ZodString, "many">;
    equipment: z.ZodArray<z.ZodString, "many">;
    isActive: z.ZodBoolean;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    address: string;
    city: string;
    postalCode: string;
    capacity: number;
    operatingHours: {
        monday: {
            start: string;
            end: string;
        }[];
        tuesday: {
            start: string;
            end: string;
        }[];
        wednesday: {
            start: string;
            end: string;
        }[];
        thursday: {
            start: string;
            end: string;
        }[];
        friday: {
            start: string;
            end: string;
        }[];
        saturday: {
            start: string;
            end: string;
        }[];
        sunday: {
            start: string;
            end: string;
        }[];
    };
    equipment: string[];
    isActive: boolean;
    specialties: string[];
    phone?: string | undefined;
    email?: string | undefined;
    manager?: string | undefined;
}, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    address: string;
    city: string;
    postalCode: string;
    capacity: number;
    operatingHours: {
        monday: {
            start: string;
            end: string;
        }[];
        tuesday: {
            start: string;
            end: string;
        }[];
        wednesday: {
            start: string;
            end: string;
        }[];
        thursday: {
            start: string;
            end: string;
        }[];
        friday: {
            start: string;
            end: string;
        }[];
        saturday: {
            start: string;
            end: string;
        }[];
        sunday: {
            start: string;
            end: string;
        }[];
    };
    equipment: string[];
    isActive: boolean;
    specialties: string[];
    phone?: string | undefined;
    email?: string | undefined;
    manager?: string | undefined;
}>;
export declare const ShiftRulesCreateSchema: z.ZodObject<{
    minNursesPerShift: z.ZodNumber;
    minNurseManagersPerShift: z.ZodNumber;
    minHelpers: z.ZodNumber;
    maxSaturdaysPerMonth: z.ZodNumber;
    maxConsecutiveSameShifts: z.ZodNumber;
    weeklyHoursOverflowTolerance: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    minNursesPerShift: number;
    minNurseManagersPerShift: number;
    minHelpers: number;
    maxSaturdaysPerMonth: number;
    maxConsecutiveSameShifts: number;
    weeklyHoursOverflowTolerance: number;
}, {
    minNursesPerShift: number;
    minNurseManagersPerShift: number;
    minHelpers: number;
    maxSaturdaysPerMonth: number;
    maxConsecutiveSameShifts: number;
    weeklyHoursOverflowTolerance: number;
}>;
export declare const ShiftRulesUpdateSchema: z.ZodObject<{
    minNursesPerShift: z.ZodOptional<z.ZodNumber>;
    minNurseManagersPerShift: z.ZodOptional<z.ZodNumber>;
    minHelpers: z.ZodOptional<z.ZodNumber>;
    maxSaturdaysPerMonth: z.ZodOptional<z.ZodNumber>;
    maxConsecutiveSameShifts: z.ZodOptional<z.ZodNumber>;
    weeklyHoursOverflowTolerance: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    minNursesPerShift?: number | undefined;
    minNurseManagersPerShift?: number | undefined;
    minHelpers?: number | undefined;
    maxSaturdaysPerMonth?: number | undefined;
    maxConsecutiveSameShifts?: number | undefined;
    weeklyHoursOverflowTolerance?: number | undefined;
}, {
    minNursesPerShift?: number | undefined;
    minNurseManagersPerShift?: number | undefined;
    minHelpers?: number | undefined;
    maxSaturdaysPerMonth?: number | undefined;
    maxConsecutiveSameShifts?: number | undefined;
    weeklyHoursOverflowTolerance?: number | undefined;
}>;
export declare const ShiftRulesResponseSchema: z.ZodObject<{
    id: z.ZodString;
    minNursesPerShift: z.ZodNumber;
    minNurseManagersPerShift: z.ZodNumber;
    minHelpers: z.ZodNumber;
    maxSaturdaysPerMonth: z.ZodNumber;
    maxConsecutiveSameShifts: z.ZodNumber;
    weeklyHoursOverflowTolerance: z.ZodNumber;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    minNursesPerShift: number;
    minNurseManagersPerShift: number;
    minHelpers: number;
    maxSaturdaysPerMonth: number;
    maxConsecutiveSameShifts: number;
    weeklyHoursOverflowTolerance: number;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    minNursesPerShift: number;
    minNurseManagersPerShift: number;
    minHelpers: number;
    maxSaturdaysPerMonth: number;
    maxConsecutiveSameShifts: number;
    weeklyHoursOverflowTolerance: number;
}>;
export declare const DayShiftPlanSchema: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>;
export declare const MonthlyShiftPlanSchema: z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>>;
export declare const GenerateShiftPlanSchema: z.ZodObject<{
    year: z.ZodNumber;
    month: z.ZodNumber;
    employeeIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    useRelaxedRules: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    year: number;
    month: number;
    useRelaxedRules: boolean;
    employeeIds?: string[] | undefined;
}, {
    year: number;
    month: number;
    employeeIds?: string[] | undefined;
    useRelaxedRules?: boolean | undefined;
}>;
export declare const ShiftPlanCreateSchema: z.ZodObject<{
    year: z.ZodNumber;
    month: z.ZodNumber;
    planData: z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>>;
    employeeAvailability: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        weeklyHoursAssigned: z.ZodNumber;
        totalHoursAssigned: z.ZodNumber;
        shiftsAssigned: z.ZodArray<z.ZodString, "many">;
        lastShiftType: z.ZodNullable<z.ZodString>;
        saturdaysWorked: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        weeklyHoursAssigned: number;
        totalHoursAssigned: number;
        shiftsAssigned: string[];
        lastShiftType: string | null;
        saturdaysWorked: number;
    }, {
        weeklyHoursAssigned: number;
        totalHoursAssigned: number;
        shiftsAssigned: string[];
        lastShiftType: string | null;
        saturdaysWorked: number;
    }>>>;
    statistics: z.ZodOptional<z.ZodObject<{
        completeDays: z.ZodNumber;
        incompleteDays: z.ZodNumber;
        completionRate: z.ZodNumber;
        averageWorkload: z.ZodNumber;
        workloadDistribution: z.ZodArray<z.ZodObject<{
            employeeId: z.ZodString;
            name: z.ZodString;
            assignedHours: z.ZodNumber;
            targetHours: z.ZodNumber;
            percentage: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            employeeId: string;
            assignedHours: number;
            targetHours: number;
            percentage: number;
        }, {
            name: string;
            employeeId: string;
            assignedHours: number;
            targetHours: number;
            percentage: number;
        }>, "many">;
        saturdayDistribution: z.ZodArray<z.ZodObject<{
            employeeId: z.ZodString;
            name: z.ZodString;
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            employeeId: string;
            count: number;
        }, {
            name: string;
            employeeId: string;
            count: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        completeDays: number;
        incompleteDays: number;
        completionRate: number;
        averageWorkload: number;
        workloadDistribution: {
            name: string;
            employeeId: string;
            assignedHours: number;
            targetHours: number;
            percentage: number;
        }[];
        saturdayDistribution: {
            name: string;
            employeeId: string;
            count: number;
        }[];
    }, {
        completeDays: number;
        incompleteDays: number;
        completionRate: number;
        averageWorkload: number;
        workloadDistribution: {
            name: string;
            employeeId: string;
            assignedHours: number;
            targetHours: number;
            percentage: number;
        }[];
        saturdayDistribution: {
            name: string;
            employeeId: string;
            count: number;
        }[];
    }>>;
}, "strip", z.ZodTypeAny, {
    year: number;
    month: number;
    planData: Record<string, Record<string, string[]> | null>;
    employeeAvailability?: Record<string, {
        weeklyHoursAssigned: number;
        totalHoursAssigned: number;
        shiftsAssigned: string[];
        lastShiftType: string | null;
        saturdaysWorked: number;
    }> | undefined;
    statistics?: {
        completeDays: number;
        incompleteDays: number;
        completionRate: number;
        averageWorkload: number;
        workloadDistribution: {
            name: string;
            employeeId: string;
            assignedHours: number;
            targetHours: number;
            percentage: number;
        }[];
        saturdayDistribution: {
            name: string;
            employeeId: string;
            count: number;
        }[];
    } | undefined;
}, {
    year: number;
    month: number;
    planData: Record<string, Record<string, string[]> | null>;
    employeeAvailability?: Record<string, {
        weeklyHoursAssigned: number;
        totalHoursAssigned: number;
        shiftsAssigned: string[];
        lastShiftType: string | null;
        saturdaysWorked: number;
    }> | undefined;
    statistics?: {
        completeDays: number;
        incompleteDays: number;
        completionRate: number;
        averageWorkload: number;
        workloadDistribution: {
            name: string;
            employeeId: string;
            assignedHours: number;
            targetHours: number;
            percentage: number;
        }[];
        saturdayDistribution: {
            name: string;
            employeeId: string;
            count: number;
        }[];
    } | undefined;
}>;
export declare const ShiftPlanResponseSchema: z.ZodObject<{
    id: z.ZodString;
    year: z.ZodNumber;
    month: z.ZodNumber;
    planData: z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>>;
    employeeAvailability: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        weeklyHoursAssigned: z.ZodNumber;
        totalHoursAssigned: z.ZodNumber;
        shiftsAssigned: z.ZodArray<z.ZodString, "many">;
        lastShiftType: z.ZodNullable<z.ZodString>;
        saturdaysWorked: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        weeklyHoursAssigned: number;
        totalHoursAssigned: number;
        shiftsAssigned: string[];
        lastShiftType: string | null;
        saturdaysWorked: number;
    }, {
        weeklyHoursAssigned: number;
        totalHoursAssigned: number;
        shiftsAssigned: string[];
        lastShiftType: string | null;
        saturdaysWorked: number;
    }>>>;
    statistics: z.ZodOptional<z.ZodObject<{
        completeDays: z.ZodNumber;
        incompleteDays: z.ZodNumber;
        completionRate: z.ZodNumber;
        averageWorkload: z.ZodNumber;
        workloadDistribution: z.ZodArray<z.ZodObject<{
            employeeId: z.ZodString;
            name: z.ZodString;
            assignedHours: z.ZodNumber;
            targetHours: z.ZodNumber;
            percentage: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            employeeId: string;
            assignedHours: number;
            targetHours: number;
            percentage: number;
        }, {
            name: string;
            employeeId: string;
            assignedHours: number;
            targetHours: number;
            percentage: number;
        }>, "many">;
        saturdayDistribution: z.ZodArray<z.ZodObject<{
            employeeId: z.ZodString;
            name: z.ZodString;
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            employeeId: string;
            count: number;
        }, {
            name: string;
            employeeId: string;
            count: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        completeDays: number;
        incompleteDays: number;
        completionRate: number;
        averageWorkload: number;
        workloadDistribution: {
            name: string;
            employeeId: string;
            assignedHours: number;
            targetHours: number;
            percentage: number;
        }[];
        saturdayDistribution: {
            name: string;
            employeeId: string;
            count: number;
        }[];
    }, {
        completeDays: number;
        incompleteDays: number;
        completionRate: number;
        averageWorkload: number;
        workloadDistribution: {
            name: string;
            employeeId: string;
            assignedHours: number;
            targetHours: number;
            percentage: number;
        }[];
        saturdayDistribution: {
            name: string;
            employeeId: string;
            count: number;
        }[];
    }>>;
    isFinalized: z.ZodBoolean;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    year: number;
    month: number;
    planData: Record<string, Record<string, string[]> | null>;
    isFinalized: boolean;
    employeeAvailability?: Record<string, {
        weeklyHoursAssigned: number;
        totalHoursAssigned: number;
        shiftsAssigned: string[];
        lastShiftType: string | null;
        saturdaysWorked: number;
    }> | undefined;
    statistics?: {
        completeDays: number;
        incompleteDays: number;
        completionRate: number;
        averageWorkload: number;
        workloadDistribution: {
            name: string;
            employeeId: string;
            assignedHours: number;
            targetHours: number;
            percentage: number;
        }[];
        saturdayDistribution: {
            name: string;
            employeeId: string;
            count: number;
        }[];
    } | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    year: number;
    month: number;
    planData: Record<string, Record<string, string[]> | null>;
    isFinalized: boolean;
    employeeAvailability?: Record<string, {
        weeklyHoursAssigned: number;
        totalHoursAssigned: number;
        shiftsAssigned: string[];
        lastShiftType: string | null;
        saturdaysWorked: number;
    }> | undefined;
    statistics?: {
        completeDays: number;
        incompleteDays: number;
        completionRate: number;
        averageWorkload: number;
        workloadDistribution: {
            name: string;
            employeeId: string;
            assignedHours: number;
            targetHours: number;
            percentage: number;
        }[];
        saturdayDistribution: {
            name: string;
            employeeId: string;
            count: number;
        }[];
    } | undefined;
}>;
export declare const ValidateShiftPlanSchema: z.ZodObject<{
    shiftPlan: z.ZodRecord<z.ZodString, z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>>;
    employeeIds: z.ZodArray<z.ZodString, "many">;
    year: z.ZodNumber;
    month: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    year: number;
    month: number;
    employeeIds: string[];
    shiftPlan: Record<string, Record<string, string[]> | null>;
}, {
    year: number;
    month: number;
    employeeIds: string[];
    shiftPlan: Record<string, Record<string, string[]> | null>;
}>;
export declare const ConstraintViolationSchema: z.ZodObject<{
    id: z.ZodString;
    shiftPlanId: z.ZodString;
    type: z.ZodEnum<["hard", "soft"]>;
    rule: z.ZodString;
    message: z.ZodString;
    employeeId: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    severity: z.ZodDefault<z.ZodNumber>;
    isResolved: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    message: string;
    id: string;
    createdAt: Date;
    type: "hard" | "soft";
    shiftPlanId: string;
    rule: string;
    severity: number;
    isResolved: boolean;
    date?: string | undefined;
    employeeId?: string | undefined;
}, {
    message: string;
    id: string;
    createdAt: Date;
    type: "hard" | "soft";
    shiftPlanId: string;
    rule: string;
    date?: string | undefined;
    employeeId?: string | undefined;
    severity?: number | undefined;
    isResolved?: boolean | undefined;
}>;
export declare const PaginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    sortBy?: string | undefined;
}, {
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export declare const ApiResponseSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
}>, any> extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never, z.baseObjectInputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    error: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
}> extends infer T_2 ? { [k_1 in keyof T_2]: T_2[k_1]; } : never>;
export declare const PaginatedResponseSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodObject<{
    data: z.ZodArray<T, "many">;
    pagination: z.ZodObject<{
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: T["_output"][];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}, {
    data: T["_input"][];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const EmployeeQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    role: z.ZodOptional<z.ZodString>;
    clinic: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    role?: string | undefined;
    isActive?: boolean | undefined;
    clinic?: string | undefined;
    sortBy?: string | undefined;
}, {
    role?: string | undefined;
    isActive?: boolean | undefined;
    clinic?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export declare const LocationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    city: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    city?: string | undefined;
    isActive?: boolean | undefined;
    sortBy?: string | undefined;
}, {
    city?: string | undefined;
    isActive?: boolean | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export declare const ShiftPlanQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    year: z.ZodOptional<z.ZodNumber>;
    month: z.ZodOptional<z.ZodNumber>;
    isFinalized: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
    year?: number | undefined;
    month?: number | undefined;
    isFinalized?: boolean | undefined;
    sortBy?: string | undefined;
}, {
    year?: number | undefined;
    month?: number | undefined;
    isFinalized?: boolean | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export declare const StatisticsQuerySchema: z.ZodObject<{
    year: z.ZodNumber;
    month: z.ZodOptional<z.ZodNumber>;
    employeeId: z.ZodOptional<z.ZodString>;
    locationId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    year: number;
    month?: number | undefined;
    employeeId?: string | undefined;
    locationId?: string | undefined;
}, {
    year: number;
    month?: number | undefined;
    employeeId?: string | undefined;
    locationId?: string | undefined;
}>;
export declare const validateRequestBody: <T>(schema: z.ZodSchema<T>) => (req: any, res: any, next: any) => any;
export declare const validateQuery: <T>(schema: z.ZodSchema<T>) => (req: any, res: any, next: any) => any;
export declare const validateParams: <T>(schema: z.ZodSchema<T>) => (req: any, res: any, next: any) => any;
//# sourceMappingURL=schemas.d.ts.map