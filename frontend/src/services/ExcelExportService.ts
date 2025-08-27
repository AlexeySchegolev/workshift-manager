import {BaseService} from './BaseService';
import {ShiftPlans} from '../api/ShiftPlans';
import {
    ExcelExportRequestDto,
    ExcelExportOptionsDto,
    MultipleExcelExportRequestDto,
    ExcelExportResultDto
} from '../api/data-contracts';

// Frontend interface for simplified API usage
interface ExcelExportOptions {
  includeStatistics?: boolean;
  includePlanning?: boolean;
  includeConstraints?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Service for Excel export functionality using backend API endpoints
 */
export class ExcelExportService extends BaseService {
    private shiftPlansApi: ShiftPlans;

    constructor() {
        super();
        this.shiftPlansApi = new ShiftPlans(this.httpClient);
    }

    /**
     * Export shift plan to Excel using backend API
     * @param shiftPlanId - The shift plan ID to export
     * @param options - Export options
     */
    async exportShiftPlan(shiftPlanId: string, options: ExcelExportOptions = {}): Promise<Blob> {
        try {
            // Convert frontend options to backend format
            const backendOptions: ExcelExportOptionsDto = {
                includeStatistics: options.includeStatistics,
                includeEmployeeDetails: options.includePlanning,
                includeConstraintViolations: options.includeConstraints,
            };

            // Add date range if provided
            if (options.dateRange) {
                backendOptions.dateRange = {
                    start: options.dateRange.start.toISOString(),
                    end: options.dateRange.end.toISOString(),
                };
            }

            const requestDto: ExcelExportRequestDto = {
                shiftPlanId,
                options: backendOptions,
            };

            const response = await this.shiftPlansApi.shiftPlansControllerExportToExcel(
                shiftPlanId,
                requestDto
            );

            // Convert the response to a Blob
            if (response.data && typeof response.data === 'object' && 'buffer' in response.data) {
                const buffer = response.data.buffer as ArrayBuffer;
                return new Blob([buffer], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
            }

            throw new Error('Invalid response format from Excel export API');
        } catch (error) {
            console.error('Error exporting shift plan to Excel:', error);
            throw new Error(`Failed to export shift plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Export multiple shift plans to Excel
     * @param shiftPlanIds - Array of shift plan IDs to export
     * @param options - Export options
     */
    async exportMultipleShiftPlans(shiftPlanIds: string[], options: ExcelExportOptions = {}): Promise<Blob> {
        try {
            // Convert frontend options to backend format
            const backendOptions: ExcelExportOptionsDto = {
                includeStatistics: options.includeStatistics,
                includeEmployeeDetails: options.includePlanning,
                includeConstraintViolations: options.includeConstraints,
            };

            // Add date range if provided
            if (options.dateRange) {
                backendOptions.dateRange = {
                    start: options.dateRange.start.toISOString(),
                    end: options.dateRange.end.toISOString(),
                };
            }

            const requestDto: MultipleExcelExportRequestDto = {
                shiftPlanIds,
                options: backendOptions,
            };

            const response = await this.shiftPlansApi.shiftPlansControllerExportMultipleToExcel(requestDto);

            // Convert the response to a Blob
            if (response.data && typeof response.data === 'object' && 'buffer' in response.data) {
                const buffer = response.data.buffer as ArrayBuffer;
                return new Blob([buffer], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
            }

            throw new Error('Invalid response format from Excel export API');
        } catch (error) {
            console.error('Error exporting multiple shift plans to Excel:', error);
            throw new Error(`Failed to export shift plans: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Download shift plan as Excel file directly
     * @param shiftPlanId - The shift plan ID to download
     * @param includeStatistics - Whether to include statistics worksheet
     * @param includeEmployeeDetails - Whether to include employee details worksheet
     */
    async downloadShiftPlanExcel(
        shiftPlanId: string,
        includeStatistics: boolean = false,
        includeEmployeeDetails: boolean = false
    ): Promise<Blob> {
        try {
            const response = await this.shiftPlansApi.shiftPlansControllerDownloadExcel(
                shiftPlanId,
                {
                    includeStatistics,
                    includeEmployeeDetails,
                }
            );

            // Convert File response to Blob
            if (response.data instanceof Blob) {
                return response.data as Blob;
            }

            // Handle File or other response types
            if (response.data && typeof response.data === 'object') {
                return response.data as Blob;
            }

            throw new Error('Invalid response format from download Excel API');
        } catch (error) {
            console.error('Error downloading shift plan Excel:', error);
            throw new Error(`Failed to download shift plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Download a blob as a file
     * @param blob - The blob to download
     * @param filename - The filename for the download
     */
    downloadBlob(blob: Blob, filename: string): void {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}