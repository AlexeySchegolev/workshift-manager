import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {ShiftPlansService} from './shift-plans.service';
import {CreateShiftPlanDto, GenerateShiftPlanDto, ValidateShiftPlanDto} from './dto/create-shift-plan.dto';
import {UpdateShiftPlanDto} from './dto/update-shift-plan.dto';
import {ShiftPlanResponseDto} from './dto/shift-plan-response.dto';
import {AdvancedPlanningOptionsDto, OptimizationCriteriaDto} from './dto/advanced-planning-options.dto';
import {ShiftPlanStatisticsDto} from './dto/shift-plan-statistics.dto';
import {
    BulkValidationRequestDto,
    ConstraintValidationResultDto,
    ValidationConfigDto
} from './dto/constraint-validation-result.dto';
import {ShiftPlanningAlgorithmService} from './services/shift-planning-algorithm.service';
import {ConstraintValidationService} from './services/constraint-validation.service';
import {EmployeeAvailabilityService} from '../employees/services/employee-availability.service';
import {ExcelExportService} from './services/excel-export.service';
import {ExcelExportRequestDto, ExcelExportResultDto, MultipleExcelExportRequestDto} from './dto/excel-export.dto';
import { getCurrentTimestamp } from '@/common/utils/date.utils';

@ApiTags('shift-plans')
@Controller('api/shift-plans')
export class ShiftPlansController {
  constructor(
    private readonly shiftPlansService: ShiftPlansService,
    private readonly shiftPlanningAlgorithmService: ShiftPlanningAlgorithmService,
    private readonly constraintValidationService: ConstraintValidationService,
    private readonly employeeAvailabilityService: EmployeeAvailabilityService,
    private readonly excelExportService: ExcelExportService,
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new shift plan',
    description: 'Creates a new shift plan for a specific month and year'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Shift plan created successfully',
    type: ShiftPlanResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or shift plan already exists for this period'
  })
  async create(@Body() createShiftPlanDto: CreateShiftPlanDto): Promise<ShiftPlanResponseDto> {
    return this.shiftPlansService.create(createShiftPlanDto);
  }

  @Post('generate')
  @ApiOperation({ 
    summary: 'Generate a shift plan automatically',
    description: 'Automatically generates a shift plan using algorithms and shift rules'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Shift plan generated successfully',
    schema: {
      type: 'object',
      properties: {
        shiftPlan: { $ref: '#/components/schemas/ShiftPlan' },
        statistics: { type: 'object' },
        violations: { type: 'array', items: { $ref: '#/components/schemas/ConstraintViolation' } }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid generation parameters or no active shift rules found'
  })
  async generate(@Body() generateShiftPlanDto: GenerateShiftPlanDto) {
    return this.shiftPlansService.generateShiftPlan(generateShiftPlanDto);
  }

  @Post('validate')
  @ApiOperation({ 
    summary: 'Validate a shift plan',
    description: 'Validates a shift plan against current shift rules and constraints'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Validation completed',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean' },
        violations: { type: 'array', items: { $ref: '#/components/schemas/ConstraintViolation' } },
        statistics: { type: 'object' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid validation parameters'
  })
  async validate(@Body() validateShiftPlanDto: ValidateShiftPlanDto) {
    return this.shiftPlansService.validateShiftPlan(validateShiftPlanDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all shift plans',
    description: 'Retrieves all shift plans with optional relation data'
  })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Include assignments and violations in response'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all shift plans',
    type: [ShiftPlanResponseDto]
  })
  async findAll(
    @Query('includeRelations') includeRelations: string = 'true'
  ): Promise<ShiftPlanResponseDto[]> {
    const include = includeRelations === 'true';
    return this.shiftPlansService.findAll(include);
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Get shift plan statistics',
    description: 'Retrieves statistics about shift plans including counts and current/next month plans'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift plan statistics',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        published: { type: 'number' },
        unpublished: { type: 'number' },
        currentMonth: { $ref: '#/components/schemas/ShiftPlan' },
        nextMonth: { $ref: '#/components/schemas/ShiftPlan' }
      }
    }
  })
  async getStats() {
    return this.shiftPlansService.getShiftPlanStats();
  }

  @Get('by-month/:year/:month')
  @ApiOperation({ 
    summary: 'Get shift plan by month and year',
    description: 'Retrieves a specific shift plan for a given month and year'
  })
  @ApiParam({ 
    name: 'year', 
    type: 'number',
    description: 'Year (e.g., 2024)'
  })
  @ApiParam({ 
    name: 'month', 
    type: 'number',
    description: 'Month (1-12)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift plan found',
    type: ShiftPlanResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Shift plan not found for the specified period'
  })
  async findByMonthYear(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number
  ): Promise<ShiftPlanResponseDto> {
    return this.shiftPlansService.findByMonthYear(year, month);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get shift plan by ID',
    description: 'Retrieves a specific shift plan by its UUID'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Shift plan UUID'
  })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Include assignments and violations in response'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift plan found',
    type: ShiftPlanResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Shift plan not found'
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeRelations') includeRelations: string = 'true'
  ): Promise<ShiftPlanResponseDto> {
    const include = includeRelations === 'true';
    return this.shiftPlansService.findOne(id, include);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update shift plan',
    description: 'Updates an existing shift plan with new data'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Shift plan UUID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift plan updated successfully',
    type: ShiftPlanResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Shift plan not found'
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data'
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateShiftPlanDto: UpdateShiftPlanDto
  ): Promise<ShiftPlanResponseDto> {
    return this.shiftPlansService.update(id, updateShiftPlanDto);
  }

  @Post(':id/publish')
  @ApiOperation({ 
    summary: 'Publish shift plan',
    description: 'Publishes a shift plan, making it active and visible to employees'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Shift plan UUID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift plan published successfully',
    type: ShiftPlanResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Shift plan not found'
  })
  @ApiBadRequestResponse({ 
    description: 'Cannot publish empty shift plan'
  })
  async publish(@Param('id', ParseUUIDPipe) id: string): Promise<ShiftPlanResponseDto> {
    return this.shiftPlansService.publish(id);
  }

  @Post(':id/unpublish')
  @ApiOperation({ 
    summary: 'Unpublish shift plan',
    description: 'Unpublishes a shift plan, making it inactive'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Shift plan UUID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift plan unpublished successfully',
    type: ShiftPlanResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Shift plan not found'
  })
  async unpublish(@Param('id', ParseUUIDPipe) id: string): Promise<ShiftPlanResponseDto> {
    return this.shiftPlansService.unpublish(id);
  }

  @Post(':id/generate-advanced')
  @ApiOperation({ 
    summary: 'Generate advanced shift plan',
    description: 'Generate a shift plan using advanced algorithms with comprehensive options'
  })
  @ApiResponse({
    status: 201,
    description: 'Advanced shift plan generated successfully',
    type: Object
  })
  @ApiParam({
    name: 'id',
    description: 'Shift plan ID',
    type: 'string',
    format: 'uuid'
  })
  async generateAdvancedShiftPlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() options: AdvancedPlanningOptionsDto
  ): Promise<any> {
    const shiftPlan = await this.shiftPlansService.findOne(id);
    const employees = await this.shiftPlansService.getEmployeesForPlan(id);
    
    const result = await this.shiftPlanningAlgorithmService.generateShiftPlan(
      employees,
      shiftPlan.year,
      shiftPlan.month,
      {
        algorithm: options.algorithm,
        optimizationLevel: options.optimizationLevel,
        strictMode: options.strictMode,
        maxPlanningAttempts: options.maxPlanningAttempts,
        employeeSortingStrategy: options.employeeSortingStrategy,
        saturdayDistributionMode: options.saturdayDistributionMode,
        constraintWeights: options.constraintWeights || {},
        allowOvertime: options.allowOvertime,
        weeklyHoursFlexibility: options.weeklyHoursFlexibility,
        consecutiveDaysLimit: options.consecutiveDaysLimit
      }
    );

    // Update the shift plan with the generated data
    await this.shiftPlansService.update(id, {
      planData: result.shiftPlan,
      planningAlgorithm: options.algorithm,
      optimizationLevel: options.optimizationLevel,
      generationTimeMs: result.statistics.planningDurationMs,
      planningAttempts: options.maxPlanningAttempts
    });

    return result;
  }

  @Post(':id/optimize')
  @ApiOperation({ 
    summary: 'Optimize existing shift plan',
    description: 'Optimize an existing shift plan to improve quality metrics'
  })
  @ApiResponse({
    status: 200,
    description: 'Shift plan optimized successfully'
  })
  @ApiParam({
    name: 'id',
    description: 'Shift plan ID',
    type: 'string',
    format: 'uuid'
  })
  async optimizeShiftPlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() criteria: OptimizationCriteriaDto
  ): Promise<any> {
    const shiftPlan = await this.shiftPlansService.findOne(id);
    const employees = await this.shiftPlansService.getEmployeesForPlan(id);
    const availabilityMap = await this.employeeAvailabilityService.getAvailabilityForShiftPlan(id);

    return await this.shiftPlanningAlgorithmService.optimizeShiftDistribution(
        shiftPlan.planData,
        employees,
        availabilityMap
    );
  }

  @Get(':id/statistics')
  @ApiOperation({ 
    summary: 'Get comprehensive shift plan statistics',
    description: 'Retrieve detailed statistics and analytics for a shift plan'
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: ShiftPlanStatisticsDto
  })
  @ApiParam({
    name: 'id',
    description: 'Shift plan ID',
    type: 'string',
    format: 'uuid'
  })
  async getShiftPlanStatistics(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<ShiftPlanStatisticsDto> {
    return this.shiftPlansService.getDetailedStatistics(id);
  }

  @Post(':id/validate-constraints')
  @ApiOperation({ 
    summary: 'Validate shift plan constraints',
    description: 'Perform comprehensive constraint validation on a shift plan'
  })
  @ApiResponse({
    status: 200,
    description: 'Constraint validation completed',
    type: ConstraintValidationResultDto
  })
  @ApiParam({
    name: 'id',
    description: 'Shift plan ID',
    type: 'string',
    format: 'uuid'
  })
  async validateShiftPlanConstraints(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() config?: ValidationConfigDto
  ): Promise<ConstraintValidationResultDto> {
    const startTime = Date.now();
    const shiftPlan = await this.shiftPlansService.findOne(id);
    const employees = await this.shiftPlansService.getEmployeesForPlan(id);
    const availabilityMap = await this.employeeAvailabilityService.getAvailabilityForShiftPlan(id);

    const validationResult = await this.constraintValidationService.validateShiftPlan(
      shiftPlan.planData,
      employees,
      availabilityMap,
      shiftPlan.organizationId
    );

    const validationDurationMs = Date.now() - startTime;

    // Transform ConstraintViolationInfo to ConstraintViolationDto format
    const transformViolation = (violation: any, violationType: any, category: any) => ({
      ...violation,
      type: violationType,
      category: category,
      employeeName: employees.find(e => e.id === violation.employeeId)?.fullName || violation.employeeId
    });

    const transformedHardViolations = validationResult.hardViolations.map(v => 
      transformViolation(v, 'HARD', 'STAFFING')
    );
    const transformedSoftViolations = validationResult.softViolations.map(v => 
      transformViolation(v, 'SOFT', 'WORKLOAD')
    );
    const transformedWarnings = (validationResult.warnings || []).map(v => 
      transformViolation(v, 'WARNING', 'PREFERENCE')
    );

    // Wrap the result with additional ConstraintValidationResultDto properties
    return {
      isValid: validationResult.isValid,
      overallScore: validationResult.overallScore,
      hardViolations: transformedHardViolations,
      softViolations: transformedSoftViolations,
      warnings: transformedWarnings,
      recommendations: validationResult.recommendations.map(rec => ({
        type: 'optimization' as const,
        priority: 3,
        title: 'Optimization Suggestion',
        description: rec
      })),
      validationTimestamp: getCurrentTimestamp(),
      validationDurationMs,
      statistics: {
        totalConstraintsChecked: transformedHardViolations.length + transformedSoftViolations.length + transformedWarnings.length,
        constraintsPassed: 0, // Would need actual constraint checking logic
        constraintsFailed: transformedHardViolations.length + transformedSoftViolations.length,
        validationSuccessRate: transformedHardViolations.length === 0 ? 100 : 0,
        averageCheckTimeMs: validationDurationMs / Math.max(1, transformedHardViolations.length + transformedSoftViolations.length),
        totalValidationTimeMs: validationDurationMs,
        categoryBreakdown: {
          STAFFING: transformedHardViolations.length,
          WORKLOAD: transformedSoftViolations.length,
          PREFERENCE: transformedWarnings.length
        }
      }
    };
  }

  @Post('bulk-validate')
  @ApiOperation({ 
    summary: 'Bulk validate multiple shift plans',
    description: 'Validate constraints for multiple shift plans in a single request'
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk validation completed'
  })
  async bulkValidateShiftPlans(
    @Body() request: BulkValidationRequestDto
  ): Promise<any> {
    const results = [];
    
    for (const shiftPlanId of request.shiftPlanIds) {
      try {
        const result = await this.validateShiftPlanConstraints(shiftPlanId);
        
        results.push({
          shiftPlanId,
          validationResult: result,
          success: true
        });
      } catch (error) {
        results.push({
          shiftPlanId,
          validationResult: null,
          success: false,
          error: error.message
        });
      }
    }

    return {
      results,
      bulkStatistics: {
        totalPlansValidated: results.length,
        plansWithoutViolations: results.filter(r => r.success && r.validationResult?.isValid).length,
        plansWithHardViolations: results.filter(r => r.success && r.validationResult?.hardViolations?.length > 0).length,
        plansWithSoftViolations: results.filter(r => r.success && r.validationResult?.softViolations?.length > 0).length,
        averageValidationTime: 0,
        totalValidationTime: 0
      },
      completionTimestamp: getCurrentTimestamp()
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete shift plan',
    description: 'Deletes a shift plan by its UUID. Only unpublished plans can be deleted.'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Shift plan UUID'
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Shift plan deleted successfully'
  })
  @ApiNotFoundResponse({ 
    description: 'Shift plan not found'
  })
  @ApiBadRequestResponse({ 
    description: 'Cannot delete published shift plan'
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.shiftPlansService.remove(id);
  }

  @Post(':id/export/excel')
  @ApiOperation({
    summary: 'Export shift plan to Excel',
    description: 'Export a single shift plan to Excel format with customizable options'
  })
  @ApiParam({
    name: 'id',
    description: 'Shift plan ID to export',
    type: 'string',
    format: 'uuid'
  })
  @ApiResponse({
    status: 200,
    description: 'Excel file generated successfully',
    type: ExcelExportResultDto,
    headers: {
      'Content-Type': {
        description: 'MIME type of the Excel file',
        schema: { type: 'string', example: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      },
      'Content-Disposition': {
        description: 'File download disposition',
        schema: { type: 'string', example: 'attachment; filename="schichtplan-2024-12.xlsx"' }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Shift plan not found'
  })
  @ApiBadRequestResponse({
    description: 'Invalid export options or export failed'
  })
  async exportToExcel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() request?: ExcelExportRequestDto
  ): Promise<{ 
    buffer: Buffer; 
    filename: string; 
    mimeType: string;
    metadata: any;
  }> {
    const options = request?.options || {};
    const result = await this.excelExportService.exportShiftPlanToExcel(id, options);
    
    return {
      buffer: result.buffer,
      filename: result.filename,
      mimeType: result.mimeType,
      metadata: result.metadata
    };
  }

  @Post('export/excel/multiple')
  @ApiOperation({
    summary: 'Export multiple shift plans to Excel',
    description: 'Export multiple shift plans to a single Excel file with separate worksheets'
  })
  @ApiResponse({
    status: 200,
    description: 'Excel file with multiple shift plans generated successfully',
    type: ExcelExportResultDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid shift plan IDs or export options'
  })
  async exportMultipleToExcel(
    @Body() request: MultipleExcelExportRequestDto
  ): Promise<{ 
    buffer: Buffer; 
    filename: string; 
    mimeType: string;
    metadata: any;
  }> {
    const options = request.options || {};
    const result = await this.excelExportService.exportMultipleShiftPlans(request.shiftPlanIds, options);
    
    return {
      buffer: result.buffer,
      filename: result.filename,
      mimeType: result.mimeType,
      metadata: result.metadata
    };
  }

  @Get(':id/export/excel/download')
  @ApiOperation({
    summary: 'Download shift plan as Excel file',
    description: 'Download a shift plan as an Excel file directly'
  })
  @ApiParam({
    name: 'id',
    description: 'Shift plan ID to download',
    type: 'string',
    format: 'uuid'
  })
  @ApiQuery({
    name: 'includeStatistics',
    required: false,
    type: Boolean,
    description: 'Include statistics worksheet'
  })
  @ApiQuery({
    name: 'includeEmployeeDetails',
    required: false,
    type: Boolean,
    description: 'Include employee details worksheet'
  })
  @ApiResponse({
    status: 200,
    description: 'Excel file download',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  async downloadExcel(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeStatistics') includeStatistics: string = 'false',
    @Query('includeEmployeeDetails') includeEmployeeDetails: string = 'false'
  ) {
    const options = {
      includeStatistics: includeStatistics === 'true',
      includeEmployeeDetails: includeEmployeeDetails === 'true'
    };
    
    const result = await this.excelExportService.exportShiftPlanToExcel(id, options);
    
    return {
      buffer: result.buffer,
      filename: result.filename,
      mimeType: result.mimeType,
      size: result.size,
      generatedAt: result.generatedAt
    };
  }
}