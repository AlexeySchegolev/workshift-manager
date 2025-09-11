import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftPlansController } from './shift-plans.controller';
import { ShiftPlansService } from './shift-plans.service';
import { ShiftPlanningUtilityService } from './services/shift-planning-utility.service';
import { ExcelExportService } from './services/excel-export.service';
import {ShiftPlan} from "@/database/entities/shift-plan.entity";
import {Employee} from "@/database/entities/employee.entity";
import {Organization} from "@/database/entities/organization.entity";
import {Location} from "@/database/entities/location.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShiftPlan,
      Employee,
      Organization,
      Location,
    ])
  ],
  controllers: [
    ShiftPlansController,
  ],
  providers: [
    ShiftPlansService,
    ShiftPlanningUtilityService,
    ExcelExportService,
  ],
  exports: [
    ShiftPlansService,
    ShiftPlanningUtilityService,
    ExcelExportService,
    TypeOrmModule,
  ],
})
export class ShiftPlansModule {}