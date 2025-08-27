import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftPlansController } from './shift-plans.controller';
import { PlanningAlgorithmsController } from './controllers/planning-algorithms.controller';
import { ShiftPlansService } from './shift-plans.service';
import { ShiftPlanningAlgorithmService } from './services/shift-planning-algorithm.service';
import { BacktrackingAlgorithmService } from './services/backtracking-algorithm.service';
import { ConstraintValidationService } from './services/constraint-validation.service';
import { ShiftPlanningUtilityService } from './services/shift-planning-utility.service';
import { ExcelExportService } from './services/excel-export.service';
import { EmployeeAvailabilityService } from '../employees/services/employee-availability.service';
import { EmployeeSortingService } from '../employees/services/employee-sorting.service';
import { ShiftPlan } from '../../database/entities/shift-plan.entity';
import { Employee } from '../../database/entities/employee.entity';
import { ShiftRules } from '../../database/entities/shift-rules.entity';
import { ShiftAssignment } from '../../database/entities/shift-assignment.entity';
import { ConstraintViolation } from '../../database/entities/constraint-violation.entity';
import { ShiftPlanningAvailability } from '../../database/entities/shift-planning-availability.entity';
import { ShiftPlanningRule } from '../../database/entities/shift-planning-rule.entity';
import { PlanningStatistics } from '../../database/entities/planning-statistics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShiftPlan,
      Employee,
      ShiftRules,
      ShiftAssignment,
      ConstraintViolation,
      ShiftPlanningAvailability,
      ShiftPlanningRule,
      PlanningStatistics,
    ])
  ],
  controllers: [
    ShiftPlansController,
    PlanningAlgorithmsController,
  ],
  providers: [
    ShiftPlansService,
    ShiftPlanningAlgorithmService,
    BacktrackingAlgorithmService,
    ConstraintValidationService,
    ShiftPlanningUtilityService,
    ExcelExportService,
    EmployeeAvailabilityService,
    EmployeeSortingService,
  ],
  exports: [
    ShiftPlansService,
    ShiftPlanningAlgorithmService,
    BacktrackingAlgorithmService,
    ConstraintValidationService,
    ShiftPlanningUtilityService,
    ExcelExportService,
    EmployeeAvailabilityService,
    EmployeeSortingService,
    TypeOrmModule,
  ],
})
export class ShiftPlansModule {}