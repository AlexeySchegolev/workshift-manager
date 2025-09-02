import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
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
import {UpdateShiftPlanDto} from './dto/update-shift-plan.dto';
import {ShiftPlanResponseDto} from './dto/shift-plan-response.dto';
import {ExcelExportService} from './services/excel-export.service';
import {ExcelExportRequestDto, ExcelExportResultDto} from './dto/excel-export.dto';

@ApiTags('shift-plans')
@Controller('api/shift-plans')
export class ShiftPlansController {
  constructor(
    private readonly shiftPlansService: ShiftPlansService,
    private readonly excelExportService: ExcelExportService,
  ) {}



  @Get()
  @ApiOperation({ 
    summary: 'Get all shift plans',
    description: 'Retrieves all shift plans with optional relation data'
  })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Include additional relation data in response'
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
    description: 'Include additional relation data in response'
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
}