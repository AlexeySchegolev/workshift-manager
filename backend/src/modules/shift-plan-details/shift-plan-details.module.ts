import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftPlanDetailsService } from './shift-plan-details.service';
import { ShiftPlanDetailsController } from './shift-plan-details.controller';
import { ShiftPlanDetail } from '@/database/entities/shift-plan-detail.entity';
import { ShiftPlan } from '@/database/entities/shift-plan.entity';
import { Employee } from '@/database/entities/employee.entity';
import { Shift } from '@/database/entities/shift.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShiftPlanDetail,
      ShiftPlan,
      Employee,
      Shift,
    ]),
  ],
  controllers: [ShiftPlanDetailsController],
  providers: [ShiftPlanDetailsService],
  exports: [ShiftPlanDetailsService],
})
export class ShiftPlanDetailsModule {}