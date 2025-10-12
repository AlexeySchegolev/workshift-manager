import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {CalculateShiftPlanDto} from './dto/calculate-shift-plan.dto';
import {ShiftPlanCalculationResponseDto} from './dto/shift-plan-calculation-response.dto';
import {ShiftPlanCalculationService} from './services/shift-plan-calculation.service';

@ApiTags('shift-plan-calculation')
@Controller('api/shift-plan-calculation')
export class ShiftPlanCalculationController {
  constructor(
    private readonly calculationService: ShiftPlanCalculationService,
  ) {}

  @Post('calculate')
  @ApiOperation({
    summary: 'Calculate shift plan',
    description: 'Calculates an optimized shift plan for the given organization, location, year and month using ShiftPlanOptimizer2'
  })
  @ApiResponse({
    status: 200,
    description: 'Shift plan calculated successfully',
    type: ShiftPlanCalculationResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or calculation failed'
  })
  @ApiNotFoundResponse({
    description: 'Organization or location not found'
  })
  async calculateShiftPlan(@Body() calculateDto: CalculateShiftPlanDto): Promise<ShiftPlanCalculationResponseDto> {
    return this.calculationService.calculateShiftPlan(calculateDto);
  }
}