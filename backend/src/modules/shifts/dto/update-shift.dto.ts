import { PartialType } from '@nestjs/swagger';
import { CreateShiftDto } from './create-shift.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateShiftDto extends PartialType(CreateShiftDto) {
  @ApiProperty({
    description: 'User ID who is updating this shift',
    example: '550e8400-e29b-41d4-a716-446655440006',
    format: 'uuid',
    required: false
  })
  @IsOptional()
  @IsUUID()
  updatedBy?: string;
}