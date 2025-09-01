import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftPlansController } from './shift-plans.controller';
import { ShiftPlansService } from './shift-plans.service';
import { ShiftPlanningUtilityService } from './services/shift-planning-utility.service';
import { ExcelExportService } from './services/excel-export.service';
import { EmployeeAvailabilityService } from '../employees/services/employee-availability.service';
import { EmployeeSortingService } from '../employees/services/employee-sorting.service';
import { ShiftPlanningAvailability } from '@/database/entities/shift-planning-availability.entity';
import { ShiftPlanningRule } from '@/database/entities/shift-planning-rule.entity';
import { PlanningStatistics } from '@/database/entities/planning-statistics.entity';
import {ShiftPlan} from "@/database/entities/shift-plan.entity";
import {Employee} from "@/database/entities/employee.entity";
import {ShiftAssignment} from "@/database/entities/shift-assignment.entity";
import {ShiftRules} from "@/database/entities/shift-rules.entity";
import {ConstraintViolation} from "@/database/entities/constraint-violation.entity";
import {Organization} from "@/database/entities/organization.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShiftPlan,
      Employee,
      ShiftRules,
      ShiftAssignment,
      ConstraintViolation,
      Organization,
      ShiftPlanningAvailability,
      ShiftPlanningRule,
      PlanningStatistics,
    ])
  ],
  controllers: [
    ShiftPlansController,
  ],
  providers: [
    ShiftPlansService,
    ShiftPlanningUtilityService,
    ExcelExportService,
    EmployeeAvailabilityService,
    EmployeeSortingService,
  ],
  exports: [
    ShiftPlansService,
    ShiftPlanningUtilityService,
    ExcelExportService,
    EmployeeAvailabilityService,
    EmployeeSortingService,
    TypeOrmModule,
  ],
})
export class ShiftPlansModule {}