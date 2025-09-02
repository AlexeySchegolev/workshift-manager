import { PartialType } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { CreateShiftPlanDto } from './create-shift-plan.dto';

export class UpdateShiftPlanDto extends PartialType(CreateShiftPlanDto) {
}