import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftPlansController } from './shift-plans.controller';
import { ShiftPlansService } from './shift-plans.service';
import { ShiftPlan } from '../../database/entities/shift-plan.entity';
import { Employee } from '../../database/entities/employee.entity';
import { ShiftRules } from '../../database/entities/shift-rules.entity';
import { ShiftAssignment } from '../../database/entities/shift-assignment.entity';
import { ConstraintViolation } from '../../database/entities/constraint-violation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShiftPlan,
      Employee,
      ShiftRules,
      ShiftAssignment,
      ConstraintViolation
    ])
  ],
  controllers: [ShiftPlansController],
  providers: [ShiftPlansService],
  exports: [ShiftPlansService, TypeOrmModule],
})
export class ShiftPlansModule {}