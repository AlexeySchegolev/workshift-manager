import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsUUID, Min, Max, Length } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description: 'Role name',
    example: 'Dialysis Specialist'
  })
  @IsString()
  @Length(1, 100)
  name: string;



  @ApiPropertyOptional({
    description: 'Created by (User ID)',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsOptional()
  @IsUUID()
  createdBy?: string;
}