// Export all entities

// Core entities
export { User, UserRole, UserStatus } from './user.entity';
export { Organization, OrganizationType, OrganizationStatus } from './organization.entity';
export { Role, RoleType, RoleStatus } from './role.entity';

// Employee and location entities
export { Employee, EmployeeStatus, ContractType } from './employee.entity';
export { Location, LocationStatus, TimeSlot, OperatingHours } from './location.entity';

// Shift management entities
export { Shift, ShiftType, ShiftStatus, ShiftPriority, ShiftRoleRequirement } from './shift.entity';
export { ShiftPlan, DayShiftPlan, MonthlyShiftPlan, ShiftPlanStatus, ApprovalStatus } from './shift-plan.entity';
export { ShiftAssignment, AssignmentStatus, AssignmentType } from './shift-assignment.entity';

// Availability and preferences
export {
  EmployeeAvailability,
  AvailabilityType,
  AvailabilityStatus,
  AbsenceReason,
  RecurrencePattern,
  TimeSlotAvailability,
  WeeklyAvailability
} from './employee-availability.entity';

export {
  ShiftPreference,
  PreferenceType,
  PreferenceCategory,
  PreferenceStatus,
  TimePreference,
  DayOfWeekPreference
} from './shift-preference.entity';

// Constraints and violations
export {
  WorkTimeConstraint,
  ConstraintType,
  ConstraintScope,
  ConstraintSeverity,
  TimeUnit,
  ConstraintRule,
  ConstraintViolationThreshold
} from './work-time-constraint.entity';

export {
  ShiftConstraint,
  ShiftConstraintType,
  ConstraintCategory,
  ConstraintPriority,
  ConstraintOperator,
  ConstraintCondition,
  ConstraintValidationResult
} from './shift-constraint.entity';

export {
  ConstraintViolation,
  ViolationType,
  ConstraintStatus,
} from './constraint-violation.entity';

// Legacy entities (to be deprecated)
export { ShiftRules } from './shift-rules.entity';