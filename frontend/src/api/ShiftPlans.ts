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
  EmployeeResponseDto,
  EmployeeUtilizationDto,
  ExcelExportMetadataDto,
  ExcelExportOptionsDto,
  ExcelExportRequestDto,
  ExcelExportResultDto,
  GenerateShiftPlanDto,
  LocationResponseDto,
  LocationStatsDto,
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

export class ShiftPlans<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Validate constraints for multiple shift plans in a single request
   *
   * @tags shift-plans
   * @name ShiftPlansControllerBulkValidateShiftPlans
   * @summary Bulk validate multiple shift plans
   * @request POST:/api/shift-plans/bulk-validate
   */
  shiftPlansControllerBulkValidateShiftPlans = (
    data: BulkValidationRequestDto,
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/api/shift-plans/bulk-validate`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    }); /**
   * @description Creates a new shift plan for a specific month and year
   *
   * @tags shift-plans
   * @name ShiftPlansControllerCreate
   * @summary Create a new shift plan
   * @request POST:/api/shift-plans
   */
  shiftPlansControllerCreate = (
    data: CreateShiftPlanDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanResponseDto, void>({
      path: `/api/shift-plans`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * @description Download a shift plan as an Excel file directly
   *
   * @tags shift-plans
   * @name ShiftPlansControllerDownloadExcel
   * @summary Download shift plan as Excel file
   * @request GET:/api/shift-plans/{id}/export/excel/download
   */
  shiftPlansControllerDownloadExcel = (
    id: string,
    query?: {
      /** Include employee details worksheet */
      includeEmployeeDetails?: boolean;
      /** Include statistics worksheet */
      includeStatistics?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<File, any>({
      path: `/api/shift-plans/${id}/export/excel/download`,
      method: "GET",
      query: query,
      ...params,
    }); /**
   * @description Export multiple shift plans to a single Excel file with separate worksheets
   *
   * @tags shift-plans
   * @name ShiftPlansControllerExportMultipleToExcel
   * @summary Export multiple shift plans to Excel
   * @request POST:/api/shift-plans/export/excel/multiple
   */
  shiftPlansControllerExportMultipleToExcel = (
    data: MultipleExcelExportRequestDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ExcelExportResultDto, void>({
      path: `/api/shift-plans/export/excel/multiple`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * @description Export a single shift plan to Excel format with customizable options
   *
   * @tags shift-plans
   * @name ShiftPlansControllerExportToExcel
   * @summary Export shift plan to Excel
   * @request POST:/api/shift-plans/{id}/export/excel
   */
  shiftPlansControllerExportToExcel = (
    id: string,
    data: ExcelExportRequestDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ExcelExportResultDto, void>({
      path: `/api/shift-plans/${id}/export/excel`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves all shift plans with optional relation data
   *
   * @tags shift-plans
   * @name ShiftPlansControllerFindAll
   * @summary Get all shift plans
   * @request GET:/api/shift-plans
   */
  shiftPlansControllerFindAll = (
    query?: {
      /** Include assignments and violations in response */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanResponseDto[], any>({
      path: `/api/shift-plans`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves a specific shift plan for a given month and year
   *
   * @tags shift-plans
   * @name ShiftPlansControllerFindByMonthYear
   * @summary Get shift plan by month and year
   * @request GET:/api/shift-plans/by-month/{year}/{month}
   */
  shiftPlansControllerFindByMonthYear = (
    year: number,
    month: number,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanResponseDto, void>({
      path: `/api/shift-plans/by-month/${year}/${month}`,
      method: "GET",
      format: "json",
      ...params,
    }); /**
   * @description Retrieves a specific shift plan by its UUID
   *
   * @tags shift-plans
   * @name ShiftPlansControllerFindOne
   * @summary Get shift plan by ID
   * @request GET:/api/shift-plans/{id}
   */
  shiftPlansControllerFindOne = (
    id: string,
    query?: {
      /** Include assignments and violations in response */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanResponseDto, void>({
      path: `/api/shift-plans/${id}`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * @description Automatically generates a shift plan using algorithms and shift rules
   *
   * @tags shift-plans
   * @name ShiftPlansControllerGenerate
   * @summary Generate a shift plan automatically
   * @request POST:/api/shift-plans/generate
   */
  shiftPlansControllerGenerate = (
    data: GenerateShiftPlanDto,
    params: RequestParams = {}
  ) =>
    this.http.request<
      {
        shiftPlan?: any;
        statistics?: object;
        violations?: any[];
      },
      void
    >({
      path: `/api/shift-plans/generate`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * @description Generate a shift plan using advanced algorithms with comprehensive options
   *
   * @tags shift-plans
   * @name ShiftPlansControllerGenerateAdvancedShiftPlan
   * @summary Generate advanced shift plan
   * @request POST:/api/shift-plans/{id}/generate-advanced
   */
  shiftPlansControllerGenerateAdvancedShiftPlan = (
    id: string,
    data: AdvancedPlanningOptionsDto,
    params: RequestParams = {}
  ) =>
    this.http.request<object, any>({
      path: `/api/shift-plans/${id}/generate-advanced`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * @description Retrieve detailed statistics and analytics for a shift plan
   *
   * @tags shift-plans
   * @name ShiftPlansControllerGetShiftPlanStatistics
   * @summary Get comprehensive shift plan statistics
   * @request GET:/api/shift-plans/{id}/statistics
   */
  shiftPlansControllerGetShiftPlanStatistics = (
    id: string,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanStatisticsDto, any>({
      path: `/api/shift-plans/${id}/statistics`,
      method: "GET",
      format: "json",
      ...params,
    }); /**
   * @description Retrieves statistics about shift plans including counts and current/next month plans
   *
   * @tags shift-plans
   * @name ShiftPlansControllerGetStats
   * @summary Get shift plan statistics
   * @request GET:/api/shift-plans/stats
   */
  shiftPlansControllerGetStats = (params: RequestParams = {}) =>
    this.http.request<
      {
        currentMonth?: any;
        nextMonth?: any;
        published?: number;
        total?: number;
        unpublished?: number;
      },
      any
    >({
      path: `/api/shift-plans/stats`,
      method: "GET",
      format: "json",
      ...params,
    }); /**
   * @description Optimize an existing shift plan to improve quality metrics
   *
   * @tags shift-plans
   * @name ShiftPlansControllerOptimizeShiftPlan
   * @summary Optimize existing shift plan
   * @request POST:/api/shift-plans/{id}/optimize
   */
  shiftPlansControllerOptimizeShiftPlan = (
    id: string,
    data: OptimizationCriteriaDto,
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/api/shift-plans/${id}/optimize`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    }); /**
   * @description Publishes a shift plan, making it active and visible to employees
   *
   * @tags shift-plans
   * @name ShiftPlansControllerPublish
   * @summary Publish shift plan
   * @request POST:/api/shift-plans/{id}/publish
   */
  shiftPlansControllerPublish = (id: string, params: RequestParams = {}) =>
    this.http.request<ShiftPlanResponseDto, void>({
      path: `/api/shift-plans/${id}/publish`,
      method: "POST",
      format: "json",
      ...params,
    }); /**
   * @description Deletes a shift plan by its UUID. Only unpublished plans can be deleted.
   *
   * @tags shift-plans
   * @name ShiftPlansControllerRemove
   * @summary Delete shift plan
   * @request DELETE:/api/shift-plans/{id}
   */
  shiftPlansControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/shift-plans/${id}`,
      method: "DELETE",
      ...params,
    }); /**
   * @description Unpublishes a shift plan, making it inactive
   *
   * @tags shift-plans
   * @name ShiftPlansControllerUnpublish
   * @summary Unpublish shift plan
   * @request POST:/api/shift-plans/{id}/unpublish
   */
  shiftPlansControllerUnpublish = (id: string, params: RequestParams = {}) =>
    this.http.request<ShiftPlanResponseDto, void>({
      path: `/api/shift-plans/${id}/unpublish`,
      method: "POST",
      format: "json",
      ...params,
    }); /**
   * @description Updates an existing shift plan with new data
   *
   * @tags shift-plans
   * @name ShiftPlansControllerUpdate
   * @summary Update shift plan
   * @request PATCH:/api/shift-plans/{id}
   */
  shiftPlansControllerUpdate = (
    id: string,
    data: UpdateShiftPlanDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanResponseDto, void>({
      path: `/api/shift-plans/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * @description Validates a shift plan against current shift rules and constraints
   *
   * @tags shift-plans
   * @name ShiftPlansControllerValidate
   * @summary Validate a shift plan
   * @request POST:/api/shift-plans/validate
   */
  shiftPlansControllerValidate = (
    data: ValidateShiftPlanDto,
    params: RequestParams = {}
  ) =>
    this.http.request<
      {
        isValid?: boolean;
        statistics?: object;
        violations?: any[];
      },
      void
    >({
      path: `/api/shift-plans/validate`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * @description Perform comprehensive constraint validation on a shift plan
   *
   * @tags shift-plans
   * @name ShiftPlansControllerValidateShiftPlanConstraints
   * @summary Validate shift plan constraints
   * @request POST:/api/shift-plans/{id}/validate-constraints
   */
  shiftPlansControllerValidateShiftPlanConstraints = (
    id: string,
    data: ValidationConfigDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ConstraintValidationResultDto, any>({
      path: `/api/shift-plans/${id}/validate-constraints`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
