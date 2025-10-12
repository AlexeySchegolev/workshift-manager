import { EmployeeAbsence } from "@/database/entities/employee-absence.entity";
import { Employee } from "@/database/entities/employee.entity";
import { Location } from "@/database/entities/location.entity";
import { Organization } from "@/database/entities/organization.entity";
import { ShiftPlan } from "@/database/entities/shift-plan.entity";
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftWeekdaysModule } from '../shift-weekdays/shift-weekdays.module';
import { ShiftsModule } from '../shifts/shifts.module';
import { ExcelExportService } from './services/excel-export.service';
import { ShiftPlanCalculationService } from './services/shift-plan-calculation.service';
import { ShiftPlanOptimizer2Service } from './services/shift-plan-optimizer.service';
import { ShiftPlanningUtilityService } from './services/shift-planning-utility.service';
import { ShiftPlanCalculationController } from './shift-plan-calculation.controller';
import { ShiftPlansController } from './shift-plans.controller';
import { ShiftPlansService } from './shift-plans.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShiftPlan,
      Employee,
      Organization,
      Location,
      EmployeeAbsence,
    ]),
    ShiftsModule,
    ShiftWeekdaysModule,
  ],
  controllers: [
    ShiftPlansController,
    ShiftPlanCalculationController,
  ],
  providers: [
    ShiftPlansService,
    ShiftPlanningUtilityService,
    ExcelExportService,
    ShiftPlanCalculationService,
    ShiftPlanOptimizer2Service,
  ],
  exports: [
    ShiftPlansService,
    ShiftPlanningUtilityService,
    ExcelExportService,
    ShiftPlanCalculationService,
    ShiftPlanOptimizer2Service,
    TypeOrmModule,
  ],
})
export class ShiftPlansModule {}