import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @ApiPropertyOptional({
    description: 'Kündigungsdatum',
    example: '2023-12-31'
  })
  @IsOptional()
  @IsDateString()
  terminationDate?: string;

  @ApiPropertyOptional({
    description: 'Notizen zum Mitarbeiter',
    example: 'Erfahrener Mitarbeiter mit Spezialisierung auf Dialyse'
  })
  @IsOptional()
  notes?: string;
}