import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { ShiftPlanningUtilityService } from './shift-planning-utility.service';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {Employee} from "@/database/entities/employee.entity";
import {DayShiftPlan, MonthlyShiftPlan, ShiftPlan} from "@/database/entities/shift-plan.entity";

export interface ExcelExportOptions {
  includeStatistics?: boolean;
  includeConstraintViolations?: boolean;
  includeEmployeeDetails?: boolean;
  customTitle?: string;
  companyLogo?: string;
  additionalColumns?: Array<{
    key: string;
    header: string;
    width?: number;
  }>;
}

export interface ExcelExportResult {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  size: number;
  generatedAt: Date;
  metadata: {
    totalShifts: number;
    totalEmployees: number;
    totalDays: number;
    exportOptions: ExcelExportOptions;
  };
}

/**
 * Service for exporting shift plans to Excel format on the backend.
 * Provides comprehensive Excel export functionality with styling and statistics.
 */
@Injectable()
export class ExcelExportService {
  private readonly logger = new Logger(ExcelExportService.name);

  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(ShiftPlan)
    private shiftPlanRepository: Repository<ShiftPlan>,
    private shiftPlanningUtilityService: ShiftPlanningUtilityService,
  ) {}

  /**
   * Export shift plan to Excel format
   * 
   * @param shiftPlanId The shift plan ID to export
   * @param options Export options and customization
   * @returns Excel file buffer and metadata
   */
  async exportShiftPlanToExcel(
    shiftPlanId: string,
    options: ExcelExportOptions = {}
  ): Promise<ExcelExportResult> {
    const startTime = Date.now();
    this.logger.log(`Starting Excel export for shift plan ${shiftPlanId}`);

    try {
      // Fetch shift plan with related data
      const shiftPlan = await this.shiftPlanRepository.findOne({
        where: { id: shiftPlanId },
        relations: ['organization']
      });

      if (!shiftPlan) {
        throw new Error(`Shift plan with ID ${shiftPlanId} not found`);
      }

      // Fetch employees involved in the plan
      const employees = await this.getEmployeesForPlan(shiftPlanId);

      // Create workbook
      const workbook = this.createWorkbook(shiftPlan);

      // Generate main shift plan worksheet
      await this.generateShiftPlanWorksheet(
        workbook,
        shiftPlan,
        employees,
        options
      );

      // Add statistics worksheet if requested
      if (options.includeStatistics) {
        await this.generateStatisticsWorksheet(
          workbook,
          shiftPlan,
          employees
        );
      }

      // Add employee details worksheet if requested
      if (options.includeEmployeeDetails) {
        await this.generateEmployeeDetailsWorksheet(
          workbook,
          employees
        );
      }

      // Generate Excel buffer
      const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
      
      const filename = this.generateFilename(shiftPlan);
      const exportDuration = Date.now() - startTime;

      this.logger.log(`Excel export completed in ${exportDuration}ms. File size: ${buffer.length} bytes`);

      return {
        buffer,
        filename,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: buffer.length,
        generatedAt: new Date(),
        metadata: {
          totalShifts: this.countTotalShifts(shiftPlan.planData),
          totalEmployees: employees.length,
          totalDays: this.countPlanningDays(shiftPlan.planData),
          exportOptions: options
        }
      };

    } catch (error) {
      this.logger.error(`Excel export failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Export multiple shift plans to a single Excel file
   * 
   * @param shiftPlanIds Array of shift plan IDs to export
   * @param options Export options
   * @returns Excel file with multiple worksheets
   */
  async exportMultipleShiftPlans(
    shiftPlanIds: string[],
    options: ExcelExportOptions = {}
  ): Promise<ExcelExportResult> {
    const startTime = Date.now();
    this.logger.log(`Starting multi-plan Excel export for ${shiftPlanIds.length} plans`);

    const workbook = new ExcelJS.Workbook();
    this.setupWorkbookProperties(workbook, 'Multiple Shift Plans Export');

    let totalShifts = 0;
    let totalEmployees = 0;
    let totalDays = 0;

    for (const shiftPlanId of shiftPlanIds) {
      try {
        const shiftPlan = await this.shiftPlanRepository.findOne({
          where: { id: shiftPlanId }
        });

        if (shiftPlan) {
          const employees = await this.getEmployeesForPlan(shiftPlanId);
          
          await this.generateShiftPlanWorksheet(
            workbook,
            shiftPlan,
            employees,
            options
          );

          totalShifts += this.countTotalShifts(shiftPlan.planData);
          totalEmployees += employees.length;
          totalDays += this.countPlanningDays(shiftPlan.planData);
        }
      } catch (error) {
        this.logger.warn(`Failed to export plan ${shiftPlanId}: ${error.message}`);
      }
    }

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
    const exportDuration = Date.now() - startTime;

    this.logger.log(`Multi-plan Excel export completed in ${exportDuration}ms`);

    return {
      buffer,
      filename: `shift-plans-export-${format(new Date(), 'yyyy-MM-dd-HHmm')}.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: buffer.length,
      generatedAt: new Date(),
      metadata: {
        totalShifts,
        totalEmployees,
        totalDays,
        exportOptions: options
      }
    };
  }

  /**
   * Create and configure workbook
   */
  private createWorkbook(shiftPlan: ShiftPlan): ExcelJS.Workbook {
    const workbook = new ExcelJS.Workbook();
    const title = `Schichtplan ${format(new Date(shiftPlan.year, shiftPlan.month - 1), 'MMMM yyyy', { locale: de })}`;
    
    this.setupWorkbookProperties(workbook, title);
    
    return workbook;
  }

  /**
   * Setup workbook properties
   */
  private setupWorkbookProperties(workbook: ExcelJS.Workbook, title: string): void {
    workbook.creator = 'Workshift Manager Backend';
    workbook.lastModifiedBy = 'Workshift Manager Backend';
    workbook.created = new Date();
    workbook.modified = new Date();
    // Note: title, subject, description properties are not available in this ExcelJS version
  }

  /**
   * Generate the main shift plan worksheet
   */
  private async generateShiftPlanWorksheet(
    workbook: ExcelJS.Workbook,
    shiftPlan: ShiftPlan,
    employees: Employee[],
    options: ExcelExportOptions
  ): Promise<void> {
    const monthName = format(new Date(shiftPlan.year, shiftPlan.month - 1), 'MMMM yyyy', { locale: de });
    const worksheetName = `Schichtplan ${monthName}`;
    
    const worksheet = workbook.addWorksheet(worksheetName, {
      properties: { tabColor: { argb: '4F81BD' } }
    });

    // Add title
    this.addWorksheetTitle(worksheet, options.customTitle || worksheetName);

    // Get all days with shifts (sorted)
    const dayKeys = this.getSortedDayKeys(shiftPlan.planData);

    // Create headers
    this.createHeaders(worksheet, dayKeys, options);

    // Add employee data rows
    this.addEmployeeRows(worksheet, employees, shiftPlan.planData, dayKeys, options);

    // Apply styling
    this.applyWorksheetStyling(worksheet, dayKeys.length + 2, employees.length + 3);

    // Add conditional formatting for shift types
    this.addConditionalFormatting(worksheet, dayKeys.length + 2, employees.length + 3);

    // Auto-fit columns
    this.autoFitColumns(worksheet);
  }

  /**
   * Generate statistics worksheet
   */
  private async generateStatisticsWorksheet(
    workbook: ExcelJS.Workbook,
    shiftPlan: ShiftPlan,
    employees: Employee[]
  ): Promise<void> {
    const worksheet = workbook.addWorksheet('Statistiken', {
      properties: { tabColor: { argb: '5CB85C' } }
    });

    this.addWorksheetTitle(worksheet, 'Schichtplan Statistiken');

    let currentRow = 3;

    // General statistics
    worksheet.getCell(`A${currentRow}`).value = 'Allgemeine Statistiken';
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
    currentRow += 2;

    const stats = this.calculatePlanStatistics(shiftPlan.planData, employees);
    
    const generalStats = [
      ['Geplante Schichten', stats.totalShifts],
      ['Geplante Stunden', stats.totalHours],
      ['Beteiligte Mitarbeiter', stats.totalEmployees],
      ['Abdeckung (%)', `${stats.coveragePercentage.toFixed(1)}%`],
      ['Durchschnittliche Stunden pro Mitarbeiter', stats.averageHoursPerEmployee.toFixed(1)]
    ];

    generalStats.forEach(([label, value]) => {
      worksheet.getCell(`A${currentRow}`).value = label;
      worksheet.getCell(`B${currentRow}`).value = value;
      currentRow++;
    });

    currentRow += 2;

    // Employee statistics
    worksheet.getCell(`A${currentRow}`).value = 'Mitarbeiterstatistiken';
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
    currentRow += 2;

    // Headers for employee stats
    const empStatsHeaders = ['Mitarbeiter', 'Rolle', 'Schichten', 'Stunden', 'Auslastung (%)'];
    empStatsHeaders.forEach((header, index) => {
      const cell = worksheet.getCell(currentRow, index + 1);
      cell.value = header;
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
    });
    currentRow++;

    // Employee data
    stats.employeeStats.forEach(empStat => {
      worksheet.getCell(`A${currentRow}`).value = empStat.name;
      worksheet.getCell(`B${currentRow}`).value = empStat.role;
      worksheet.getCell(`C${currentRow}`).value = empStat.shiftsCount;
      worksheet.getCell(`D${currentRow}`).value = empStat.totalHours;
      worksheet.getCell(`E${currentRow}`).value = `${empStat.utilizationPercent.toFixed(1)}%`;
      currentRow++;
    });

    // Apply borders and formatting
    this.applyStatisticsWorksheetStyling(worksheet, currentRow - 1);
  }

  /**
   * Generate employee details worksheet
   */
  private async generateEmployeeDetailsWorksheet(
    workbook: ExcelJS.Workbook,
    employees: Employee[]
  ): Promise<void> {
    const worksheet = workbook.addWorksheet('Mitarbeiterdetails', {
      properties: { tabColor: { argb: 'F0AD4E' } }
    });

    this.addWorksheetTitle(worksheet, 'Mitarbeiterdetails');

    const headers = [
      'Name',
      'Rolle',
      'E-Mail',
      'Standort',
      'Stunden/Monat',
      'Vertrag',
      'Status',
      'Samstag verfügbar',
      'Sonntag verfügbar'
    ];

    // Add headers
    headers.forEach((header, index) => {
      const cell = worksheet.getCell(3, index + 1);
      cell.value = header;
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
    });

    // Add employee data
    employees.forEach((employee, index) => {
      const row = index + 4;
      worksheet.getCell(`A${row}`).value = employee.fullName;
      worksheet.getCell(`B${row}`).value = employee.primaryRole?.name || 'N/A';
      worksheet.getCell(`C${row}`).value = employee.email;
      worksheet.getCell(`D${row}`).value = employee.location?.name || 'N/A';
      worksheet.getCell(`E${row}`).value = employee.hoursPerMonth;
      worksheet.getCell(`F${row}`).value = employee.contractType;
      worksheet.getCell(`G${row}`).value = employee.status;
      worksheet.getCell(`H${row}`).value = employee.saturdayAvailability ? 'Ja' : 'Nein';
      worksheet.getCell(`I${row}`).value = employee.sundayAvailability ? 'Ja' : 'Nein';
    });

    // Auto-fit columns
    this.autoFitColumns(worksheet);

    // Apply borders
    const range = `A3:I${employees.length + 3}`;
    this.applyBorders(worksheet, range);
  }

  /**
   * Add worksheet title
   */
  private addWorksheetTitle(worksheet: ExcelJS.Worksheet, title: string): void {
    worksheet.mergeCells('A1:G1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = title;
    titleCell.font = { size: 16, bold: true, color: { argb: '2F75B5' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 30;
  }

  /**
   * Create headers for the shift plan
   */
  private createHeaders(
    worksheet: ExcelJS.Worksheet,
    dayKeys: string[],
    options: ExcelExportOptions
  ): void {
    const headerRow1 = worksheet.addRow(['Mitarbeiter', 'Rolle']);
    const headerRow2 = worksheet.addRow(['', '']);

    let columnIndex = 3;
    
    // Add date headers
    dayKeys.forEach(dayKey => {
      const date = this.shiftPlanningUtilityService.parseDayKey(dayKey);
      
      // First row: Date (DD.MM.)
      headerRow1.getCell(columnIndex).value = format(date, 'dd.MM.');
      
      // Second row: Weekday
      headerRow2.getCell(columnIndex).value = format(date, 'EEE', { locale: de });
      
      worksheet.getColumn(columnIndex).width = 12;
      columnIndex++;
    });

    // Add additional columns if specified
    if (options.additionalColumns) {
      options.additionalColumns.forEach(col => {
        headerRow1.getCell(columnIndex).value = col.header;
        headerRow2.getCell(columnIndex).value = '';
        if (col.width) {
          worksheet.getColumn(columnIndex).width = col.width;
        }
        columnIndex++;
      });
    }

    // Style headers
    [headerRow1, headerRow2].forEach(row => {
      row.font = { bold: true, color: { argb: 'FFFFFF' } };
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } };
      row.alignment = { horizontal: 'center', vertical: 'middle' };
    });
  }

  /**
   * Add employee data rows
   */
  private addEmployeeRows(
    worksheet: ExcelJS.Worksheet,
    employees: Employee[],
    planData: MonthlyShiftPlan,
    dayKeys: string[],
    options: ExcelExportOptions
  ): void {
    employees.forEach(employee => {
      const rowData = [employee.fullName, employee.primaryRole?.name || 'N/A'];
      
      // Add shift data for each day
      dayKeys.forEach(dayKey => {
        const shift = this.getEmployeeShiftForDay(employee.id, dayKey, planData);
        rowData.push(shift || '');
      });

      // Add additional column data if specified
      if (options.additionalColumns) {
        options.additionalColumns.forEach(col => {
          // This would be populated based on the column key
          // For now, we'll add empty values
          rowData.push('');
        });
      }

      const row = worksheet.addRow(rowData);
      
      // Style the row
      row.alignment = { vertical: 'middle' };
      row.getCell(1).font = { bold: false };
      row.getCell(2).font = { bold: false };
      
      // Center-align shift cells
      for (let i = 3; i <= dayKeys.length + 2; i++) {
        row.getCell(i).alignment = { horizontal: 'center', vertical: 'middle' };
      }
    });
  }

  /**
   * Apply worksheet styling
   */
  private applyWorksheetStyling(
    worksheet: ExcelJS.Worksheet,
    totalColumns: number,
    totalRows: number
  ): void {
    // Set column widths
    worksheet.getColumn(1).width = 30; // Employee name
    worksheet.getColumn(2).width = 15; // Role

    // Apply borders to all cells
    const range = `A1:${this.getColumnLetter(totalColumns)}${totalRows}`;
    this.applyBorders(worksheet, range);

    // Freeze panes
    worksheet.views = [{ 
      state: 'frozen', 
      xSplit: 2, 
      ySplit: 2, 
      topLeftCell: 'C3' 
    }];
  }

  /**
   * Add conditional formatting for shift types
   */
  private addConditionalFormatting(
    worksheet: ExcelJS.Worksheet,
    totalColumns: number,
    totalRows: number
  ): void {
    const shiftRange = `C3:${this.getColumnLetter(totalColumns)}${totalRows}`;

    // Morning shift (F) - Light green
    worksheet.addConditionalFormatting({
      ref: shiftRange,
      rules: [{
        type: 'cellIs',
        operator: 'equal',
        formulae: ['"F"'],
        priority: 1,
        style: {
          fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'E6F8E0' } }
        }
      }]
    });

    // Evening shift (S) - Light orange
    worksheet.addConditionalFormatting({
      ref: shiftRange,
      rules: [{
        type: 'cellIs',
        operator: 'equal',
        formulae: ['"S"'],
        priority: 2,
        style: {
          fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FCE4D6' } }
        }
      }]
    });

    // Split shift (FS) - Light blue
    worksheet.addConditionalFormatting({
      ref: shiftRange,
      rules: [{
        type: 'cellIs',
        operator: 'equal',
        formulae: ['"FS"'],
        priority: 3,
        style: {
          fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'DAEEF3' } }
        }
      }]
    });
  }

  // Helper methods

  private async getEmployeesForPlan(shiftPlanId: string): Promise<Employee[]> {
    // This would need to be implemented based on your specific logic
    // For now, return all active employees
    return await this.employeeRepository.find({
      where: { isActive: true },
      relations: ['primaryRole', 'location']
    });
  }

  private getSortedDayKeys(planData: MonthlyShiftPlan): string[] {
    return Object.keys(planData)
      .filter(key => planData[key] !== null)
      .sort((a, b) => {
        const dateA = this.shiftPlanningUtilityService.parseDayKey(a);
        const dateB = this.shiftPlanningUtilityService.parseDayKey(b);
        return dateA.getTime() - dateB.getTime();
      });
  }

  private getEmployeeShiftForDay(
    employeeId: string,
    dayKey: string,
    planData: MonthlyShiftPlan
  ): string | null {
    const dayPlan = planData[dayKey] as DayShiftPlan;
    if (!dayPlan) return null;

    for (const shiftName in dayPlan) {
      if (dayPlan[shiftName].includes(employeeId)) {
        return shiftName;
      }
    }
    return null;
  }

  private countTotalShifts(planData: MonthlyShiftPlan): number {
    let count = 0;
    for (const dayKey in planData) {
      const dayPlan = planData[dayKey] as DayShiftPlan;
      if (dayPlan) {
        for (const shiftName in dayPlan) {
          count += dayPlan[shiftName].length;
        }
      }
    }
    return count;
  }

  private countPlanningDays(planData: MonthlyShiftPlan): number {
    return Object.keys(planData).filter(key => planData[key] !== null).length;
  }

  private calculatePlanStatistics(planData: MonthlyShiftPlan, employees: Employee[]): any {
    const stats = {
      totalShifts: this.countTotalShifts(planData),
      totalHours: 0,
      totalEmployees: employees.length,
      coveragePercentage: 0,
      averageHoursPerEmployee: 0,
      employeeStats: []
    };

    // Calculate employee-specific statistics
    employees.forEach(employee => {
      let shiftsCount = 0;
      let totalHours = 0;

      for (const dayKey in planData) {
        const dayPlan = planData[dayKey] as DayShiftPlan;
        if (dayPlan) {
          for (const shiftName in dayPlan) {
            if (dayPlan[shiftName].includes(employee.id)) {
              shiftsCount++;
              totalHours += this.getShiftHours(shiftName);
            }
          }
        }
      }

      stats.employeeStats.push({
        name: employee.fullName,
        role: employee.primaryRole?.name || 'N/A',
        shiftsCount,
        totalHours,
        utilizationPercent: employee.hoursPerMonth > 0 ? (totalHours / employee.hoursPerMonth) * 100 : 0
      });

      stats.totalHours += totalHours;
    });

    stats.averageHoursPerEmployee = stats.totalEmployees > 0 ? stats.totalHours / stats.totalEmployees : 0;
    stats.coveragePercentage = this.calculateCoveragePercentage(planData);

    return stats;
  }

  private calculateCoveragePercentage(planData: MonthlyShiftPlan): number {
    const totalDays = Object.keys(planData).length;
    const coveredDays = Object.keys(planData).filter(key => planData[key] !== null).length;
    return totalDays > 0 ? (coveredDays / totalDays) * 100 : 0;
  }

  private getShiftHours(shiftName: string): number {
    const shiftHours = { 'F': 8, 'S': 8, 'FS': 6 };
    return shiftHours[shiftName] || 8;
  }

  private generateFilename(shiftPlan: ShiftPlan): string {
    const monthYear = format(new Date(shiftPlan.year, shiftPlan.month - 1), 'yyyy-MM');
    return `schichtplan-${monthYear}-${format(new Date(), 'yyyy-MM-dd-HHmm')}.xlsx`;
  }

  private applyBorders(worksheet: ExcelJS.Worksheet, range: string): void {
    worksheet.getCell(range).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  }

  private applyStatisticsWorksheetStyling(worksheet: ExcelJS.Worksheet, lastRow: number): void {
    // Apply borders to statistics tables
    for (let row = 1; row <= lastRow; row++) {
      for (let col = 1; col <= 5; col++) {
        const cell = worksheet.getCell(row, col);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    }
  }

  private autoFitColumns(worksheet: ExcelJS.Worksheet): void {
    worksheet.columns.forEach(column => {
      if (column.values) {
        const lengths = column.values.map(v => v ? v.toString().length : 0);
        const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
        column.width = Math.min(Math.max(maxLength + 2, 10), 50);
      }
    });
  }

  private getColumnLetter(columnNumber: number): string {
    let result = '';
    while (columnNumber > 0) {
      const remainder = (columnNumber - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      columnNumber = Math.floor((columnNumber - remainder) / 26);
    }
    return result;
  }
}