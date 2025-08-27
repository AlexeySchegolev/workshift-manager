import { PartialType } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { CreateShiftPlanDto } from './create-shift-plan.dto';

export class UpdateShiftPlanDto extends PartialType(CreateShiftPlanDto) {
  @ApiPropertyOptional({
    description: 'Planning algorithm used for this shift plan',
    example: 'enhanced_backtracking'
  })
  @IsOptional()
  @IsString()
  planningAlgorithm?: string;

  @ApiPropertyOptional({
    description: 'Optimization level used for this shift plan',
    example: 'standard'
  })
  @IsOptional()
  @IsString()
  optimizationLevel?: string;

  @ApiPropertyOptional({
    description: 'Time taken to generate this shift plan in milliseconds',
    example: 15000
  })
  @IsOptional()
  @IsNumber()
  generationTimeMs?: number;

  @ApiPropertyOptional({
    description: 'Number of planning attempts made',
    example: 3
  })
  @IsOptional()
  @IsNumber()
  planningAttempts?: number;
}