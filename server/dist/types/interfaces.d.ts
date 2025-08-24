export interface Employee {
    id: string;
    name: string;
    role: EmployeeRole;
    hoursPerMonth: number;
    hoursPerWeek?: number;
    location?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export type EmployeeRole = 'Specialist' | 'Assistant' | 'ShiftLeader';
export interface Shift {
    start: string;
    end: string;
    roles: EmployeeRole[];
}
export interface ShiftDefinitions {
    longDays: {
        [key: string]: Shift;
    };
    shortDays: {
        [key: string]: Shift;
    };
}
export interface DayShiftPlan {
    [shiftName: string]: string[];
}
export interface MonthlyShiftPlan {
    [dateKey: string]: DayShiftPlan | null;
}
export interface ShiftPlanEntity {
    id: string;
    year: number;
    month: number;
    planData: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ShiftAssignment {
    id: string;
    shiftPlanId: string;
    employeeId: string;
    date: string;
    shiftType: string;
    hours: number;
    createdAt: Date;
}
export interface EmployeeAvailability {
    [employeeId: string]: {
        weeklyHoursAssigned: number;
        totalHoursAssigned: number;
        shiftsAssigned: string[];
        lastShiftType: string | null;
        saturdaysWorked: number;
    };
}
export type ConstraintStatus = 'ok' | 'warning' | 'violation' | 'info';
export interface ConstraintCheck {
    status: ConstraintStatus;
    message: string;
}
export interface ConstraintViolation {
    id: string;
    shiftPlanId: string;
    type: 'hard' | 'soft';
    rule: string;
    message: string;
    employeeId?: string;
    date?: string;
    createdAt: Date;
}
export interface ShiftRules {
    id?: string;
    minNursesPerShift: number;
    minNurseManagersPerShift: number;
    minHelpers: number;
    maxSaturdaysPerMonth: number;
    maxConsecutiveSameShifts: number;
    weeklyHoursOverflowTolerance: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface Location {
    id: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone?: string;
    email?: string;
    manager?: string;
    capacity: number;
    operatingHours: {
        monday: TimeSlot[];
        tuesday: TimeSlot[];
        wednesday: TimeSlot[];
        thursday: TimeSlot[];
        friday: TimeSlot[];
        saturday: TimeSlot[];
        sunday: TimeSlot[];
    };
    services: string[];
    equipment: string[];
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface TimeSlot {
    start: string;
    end: string;
}
export interface LocationStats {
    totalClients: number;
    averageUtilization: number;
    employeeCount: number;
    monthlyRevenue?: number;
    clientSatisfaction?: number;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface GenerateShiftPlanRequest {
    year: number;
    month: number;
    employeeIds?: string[];
    useRelaxedRules?: boolean;
}
export interface GenerateShiftPlanResponse {
    shiftPlan: MonthlyShiftPlan;
    employeeAvailability: EmployeeAvailability;
    violations: {
        hard: ConstraintViolation[];
        soft: ConstraintViolation[];
    };
    statistics: PlanningStatistics;
}
export interface PlanningStatistics {
    completeDays: number;
    incompleteDays: number;
    completionRate: number;
    averageWorkload: number;
    workloadDistribution: {
        employeeId: string;
        name: string;
        assignedHours: number;
        targetHours: number;
        percentage: number;
    }[];
    saturdayDistribution: {
        employeeId: string;
        name: string;
        count: number;
    }[];
}
export interface ValidateShiftPlanRequest {
    shiftPlan: MonthlyShiftPlan;
    employeeIds: string[];
    year: number;
    month: number;
}
export interface ValidateShiftPlanResponse {
    isValid: boolean;
    violations: {
        hard: ConstraintViolation[];
        soft: ConstraintViolation[];
    };
    suggestions?: string[];
}
//# sourceMappingURL=interfaces.d.ts.map