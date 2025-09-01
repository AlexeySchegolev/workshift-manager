import {
  Controller,
  Post,
  Body,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse
} from '@nestjs/swagger';
import { ShiftPlanningAlgorithmService, PlanningOptions } from '../services/shift-planning-algorithm.service';
import { ShiftPlansService } from '../shift-plans.service';
import { AdvancedPlanningOptionsDto, BacktrackingConfigDto } from '../dto/advanced-planning-options.dto';
import { getCurrentTimestamp } from '@/common/utils/date.utils';

/**
 * Controller for specialized planning algorithm operations.
 * Provides endpoints for different planning algorithms and their configurations.
 */
@ApiTags('planning-algorithms')
@Controller('api/planning-algorithms')
export class PlanningAlgorithmsController {
  constructor(
    private readonly shiftPlanningAlgorithmService: ShiftPlanningAlgorithmService,
    private readonly shiftPlansService: ShiftPlansService,
  ) {}

    @Post('enhanced-backtracking/execute')
  @ApiOperation({ 
    summary: 'Execute enhanced backtracking algorithm',
    description: 'Run the enhanced backtracking algorithm with specific configuration'
  })
  @ApiResponse({
    status: 201,
    description: 'Enhanced backtracking algorithm executed successfully'
  })
  async executeEnhancedBacktracking(
    @Body() request: {
      shiftPlanId: string;
      options: AdvancedPlanningOptionsDto;
      backtrackingConfig?: BacktrackingConfigDto;
    }
  ): Promise<any> {
    const { shiftPlanId, options, backtrackingConfig } = request;

    // Validate shift plan exists
    const shiftPlan = await this.shiftPlansService.findOne(shiftPlanId);
    if (!shiftPlan) {
      throw new NotFoundException(`Shift plan with ID ${shiftPlanId} not found`);
    }

    // Get employees for the plan
    const employees = await this.shiftPlansService.getEmployeesForPlan(shiftPlanId);
    if (employees.length === 0) {
      throw new BadRequestException('No employees available for planning');
    }

    // Convert options to planning options
    const planningOptions: PlanningOptions = {
      algorithm: 'enhanced_backtracking',
      optimizationLevel: options.optimizationLevel,
      strictMode: options.strictMode,
      maxPlanningAttempts: options.maxPlanningAttempts,
      employeeSortingStrategy: options.employeeSortingStrategy,
      saturdayDistributionMode: options.saturdayDistributionMode,
      constraintWeights: options.constraintWeights || {},
      allowOvertime: options.allowOvertime,
      weeklyHoursFlexibility: options.weeklyHoursFlexibility,
      consecutiveDaysLimit: options.consecutiveDaysLimit
    };

    // Execute the algorithm
    const result = await this.shiftPlanningAlgorithmService.generateShiftPlan(
      employees,
      shiftPlan.year,
      shiftPlan.month,
      planningOptions
    );

    return {
      algorithmUsed: 'enhanced_backtracking',
      executionId: `exec_${Date.now()}`,
      result,
      configuration: {
        planningOptions,
        backtrackingConfig
      },
      metadata: {
        employeeCount: employees.length,
        planningPeriod: `${shiftPlan.year}-${shiftPlan.month}`,
        executedAt: getCurrentTimestamp()
      }
    };
  }

  @Post('mixed/execute')
  @ApiOperation({ 
    summary: 'Execute mixed algorithm approach',
    description: 'Run a hybrid approach using multiple algorithms'
  })
  @ApiResponse({
    status: 201,
    description: 'Mixed algorithm approach executed successfully'
  })
  async executeMixedAlgorithm(
    @Body() request: {
      shiftPlanId: string;
      options: AdvancedPlanningOptionsDto;
      algorithmPriority?: string[];
    }
  ): Promise<any> {
    const { shiftPlanId, options } = request;

    // First, try enhanced backtracking
    try {
      const backtrackingResult = await this.executeEnhancedBacktracking({
        shiftPlanId,
        options
      });

      // If successful and meets quality threshold, return result
      if (backtrackingResult.result.success && 
          backtrackingResult.result.constraintValidation.overallScore >= 80) {
        return {
          algorithmUsed: 'mixed (primary: enhanced_backtracking)',
          executionId: `mixed_${Date.now()}`,
          result: backtrackingResult.result,
          fallbackUsed: false,
          primaryAlgorithm: 'enhanced_backtracking',
          qualityScore: backtrackingResult.result.constraintValidation.overallScore
        };
      }

      // If quality is not sufficient, could try other algorithms
      // For now, return the backtracking result with a note
      return {
        algorithmUsed: 'mixed (primary: enhanced_backtracking)',
        executionId: `mixed_${Date.now()}`,
        result: backtrackingResult.result,
        fallbackUsed: false,
        primaryAlgorithm: 'enhanced_backtracking',
        qualityScore: backtrackingResult.result.constraintValidation.overallScore,
        note: 'Primary algorithm used; additional algorithms could be implemented for fallback'
      };

    } catch (error) {
      // In case of failure, could implement fallback algorithms
      throw new BadRequestException(`Mixed algorithm execution failed: ${error.message}`);
    }
  }
}