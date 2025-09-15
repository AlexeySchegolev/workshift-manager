import { PartialType } from '@nestjs/swagger';
import { CreateShiftRoleDto } from './create-shift-role.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateShiftRoleDto extends PartialType(CreateShiftRoleDto) {
  @ApiProperty({
    description: 'User ID who updated this record',
    example: '550e8400-e29b-41d4-a716-446655440002',
    format: 'uuid',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  updatedBy?: string;
}