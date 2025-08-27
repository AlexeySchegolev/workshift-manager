/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import type { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  HttpClient,
  RequestParams,
  ContentType,
  HttpResponse,
} from "./http-client";
import {
  AdditionalColumnDto,
  AdvancedPlanningOptionsDto,
  BulkValidationRequestDto,
  ConstraintValidationResultDto,
  ConstraintViolationDto,
  ConstraintViolationResponseDto,
  ConstraintViolationsSummaryDto,
  ConstraintWeightsDto,
  CreateEmployeeDto,
  CreateLocationDto,
  CreateOrganizationDto,
  CreateRoleDto,
  CreateShiftDto,
  CreateShiftPlanDto,
  CreateShiftRulesDto,
  CreateUserDto,
  DateRangeDto,
  DayShiftPlanDto,
  EmployeeAvailabilityResponseDto,
  EmployeeResponseDto,
  EmployeeUtilizationDto,
  ExcelExportMetadataDto,
  ExcelExportOptionsDto,
  ExcelExportRequestDto,
  ExcelExportResultDto,
  GenerateShiftPlanDto,
  LocationResponseDto,
  LocationStatsDto,
  MonthlyShiftPlanDto,
  MultipleExcelExportRequestDto,
  OperatingHoursDto,
  OptimizationCriteriaDto,
  OrganizationResponseDto,
  PlanningPerformanceDto,
  QualityMetricsDto,
  RoleResponseDto,
  ShiftAssignmentResponseDto,
  ShiftDistributionDto,
  ShiftPlanResponseDto,
  ShiftPlanStatisticsDto,
  ShiftResponseDto,
  ShiftRoleRequirementDto,
  ShiftRulesResponseDto,
  TimeSlotDto,
  UpdateEmployeeDto,
  UpdateLocationDto,
  UpdateOrganizationDto,
  UpdateRoleDto,
  UpdateShiftDto,
  UpdateShiftPlanDto,
  UpdateShiftRulesDto,
  UpdateUserDto,
  UserResponseDto,
  ValidateShiftPlanDto,
  ValidationConfigDto,
  ValidationRecommendationDto,
  ValidationStatisticsDto,
} from "./data-contracts";

export class Shifts<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Creates a new shift with validation for time ranges and staffing requirements
   *
   * @tags shifts
   * @name ShiftsControllerCreate
   * @summary Create new shift
   * @request POST:/api/shifts
   */
  shiftsControllerCreate = (data: CreateShiftDto, params: RequestParams = {}) =>
    this.http.request<ShiftResponseDto, void>({
      path: `/api/shifts`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves all shifts with optional filtering by organization, location, or active status
   *
   * @tags shifts
   * @name ShiftsControllerFindAll
   * @summary Get all shifts
   * @request GET:/api/shifts
   */
  shiftsControllerFindAll = (
    query?: {
      /** Only return active shifts */
      activeOnly?: boolean;
      /** Include related entities (organization, location, roles) */
      includeRelations?: boolean;
      /**
       * Filter by location ID
       * @format uuid
       */
      locationId?: string;
      /**
       * Filter by organization ID
       * @format uuid
       */
      organizationId?: string;
      /**
       * Filter by shift plan ID
       * @format uuid
       */
      shiftPlanId?: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftResponseDto[], any>({
      path: `/api/shifts`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves shifts within a specified date range
   *
   * @tags shifts
   * @name ShiftsControllerFindByDateRange
   * @summary Get shifts by date range
   * @request GET:/api/shifts/date-range
   */
  shiftsControllerFindByDateRange = (
    query: {
      /**
       * End date (YYYY-MM-DD)
       * @format date
       * @example "2024-01-31"
       */
      endDate: string;
      /**
       * Filter by location ID
       * @format uuid
       */
      locationId?: string;
      /**
       * Filter by organization ID
       * @format uuid
       */
      organizationId?: string;
      /**
       * Start date (YYYY-MM-DD)
       * @format date
       * @example "2024-01-01"
       */
      startDate: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftResponseDto[], void>({
      path: `/api/shifts/date-range`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves a specific shift by its UUID
   *
   * @tags shifts
   * @name ShiftsControllerFindOne
   * @summary Get shift by ID
   * @request GET:/api/shifts/{id}
   */
  shiftsControllerFindOne = (
    id: string,
    query?: {
      /** Include related entities and assignments */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftResponseDto, void>({
      path: `/api/shifts/${id}`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves statistics about shifts including counts by type, status, and staffing information
   *
   * @tags shifts
   * @name ShiftsControllerGetStats
   * @summary Get shift statistics
   * @request GET:/api/shifts/stats
   */
  shiftsControllerGetStats = (
    query?: {
      /**
       * Filter statistics by organization ID
       * @format uuid
       */
      organizationId?: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<
      {
        active?: number;
        averageStaffing?: number;
        byStatus?: Record<string, number>;
        byType?: Record<string, number>;
        inactive?: number;
        total?: number;
      },
      any
    >({
      path: `/api/shifts/stats`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * @description Permanently deletes a shift from the database (cannot be undone)
   *
   * @tags shifts
   * @name ShiftsControllerHardRemove
   * @summary Hard delete shift
   * @request DELETE:/api/shifts/{id}/hard
   */
  shiftsControllerHardRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/shifts/${id}/hard`,
      method: "DELETE",
      ...params,
    }); /**
   * @description Soft deletes a shift by marking it as inactive and setting deletedAt timestamp
   *
   * @tags shifts
   * @name ShiftsControllerRemove
   * @summary Delete shift (soft delete)
   * @request DELETE:/api/shifts/{id}
   */
  shiftsControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/shifts/${id}`,
      method: "DELETE",
      ...params,
    }); /**
   * @description Restores a soft-deleted shift
   *
   * @tags shifts
   * @name ShiftsControllerRestore
   * @summary Restore deleted shift
   * @request POST:/api/shifts/{id}/restore
   */
  shiftsControllerRestore = (id: string, params: RequestParams = {}) =>
    this.http.request<ShiftResponseDto, void>({
      path: `/api/shifts/${id}/restore`,
      method: "POST",
      format: "json",
      ...params,
    }); /**
   * @description Updates an existing shift with validation
   *
   * @tags shifts
   * @name ShiftsControllerUpdate
   * @summary Update shift
   * @request PATCH:/api/shifts/{id}
   */
  shiftsControllerUpdate = (
    id: string,
    data: UpdateShiftDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftResponseDto, void>({
      path: `/api/shifts/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
