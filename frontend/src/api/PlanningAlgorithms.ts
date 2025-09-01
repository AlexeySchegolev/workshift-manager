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

export class PlanningAlgorithms<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Run the enhanced backtracking algorithm with specific configuration
   *
   * @tags planning-algorithms
   * @name PlanningAlgorithmsControllerExecuteEnhancedBacktracking
   * @summary Execute enhanced backtracking algorithm
   * @request POST:/api/planning-algorithms/enhanced-backtracking/execute
   */
  planningAlgorithmsControllerExecuteEnhancedBacktracking = (
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/api/planning-algorithms/enhanced-backtracking/execute`,
      method: "POST",
      ...params,
    }); /**
   * @description Run a hybrid approach using multiple algorithms
   *
   * @tags planning-algorithms
   * @name PlanningAlgorithmsControllerExecuteMixedAlgorithm
   * @summary Execute mixed algorithm approach
   * @request POST:/api/planning-algorithms/mixed/execute
   */
  planningAlgorithmsControllerExecuteMixedAlgorithm = (
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/api/planning-algorithms/mixed/execute`,
      method: "POST",
      ...params,
    });
}
