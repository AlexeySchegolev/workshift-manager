import { PartialType } from '@nestjs/mapped-types';
import { CreateShiftWeekdayDto } from './create-shift-weekday.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateShiftWeekdayDto extends PartialType(CreateShiftWeekdayDto) {
  @IsOptional()
  @IsUUID()
  updatedBy?: string;
}