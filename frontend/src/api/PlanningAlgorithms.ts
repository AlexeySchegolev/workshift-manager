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

export class PlanningAlgorithms<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Compare results from different algorithms for the same shift plan
   *
   * @tags planning-algorithms
   * @name PlanningAlgorithmsControllerCompareAlgorithms
   * @summary Compare algorithm results
   * @request POST:/api/planning-algorithms/compare
   */
  planningAlgorithmsControllerCompareAlgorithms = (
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/api/planning-algorithms/compare`,
      method: "POST",
      ...params,
    }); /**
   * @description Run the constraint satisfaction problem solver algorithm
   *
   * @tags planning-algorithms
   * @name PlanningAlgorithmsControllerExecuteConstraintSatisfaction
   * @summary Execute constraint satisfaction algorithm
   * @request POST:/api/planning-algorithms/constraint-satisfaction/execute
   */
  planningAlgorithmsControllerExecuteConstraintSatisfaction = (
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/api/planning-algorithms/constraint-satisfaction/execute`,
      method: "POST",
      ...params,
    }); /**
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
    }); /**
   * @description Retrieve a list of all available planning algorithms with their capabilities
   *
   * @tags planning-algorithms
   * @name PlanningAlgorithmsControllerGetAvailableAlgorithms
   * @summary Get available planning algorithms
   * @request GET:/api/planning-algorithms/available
   */
  planningAlgorithmsControllerGetAvailableAlgorithms = (
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/api/planning-algorithms/available`,
      method: "GET",
      ...params,
    }); /**
   * @description Retrieve pre-configured templates for different use cases
   *
   * @tags planning-algorithms
   * @name PlanningAlgorithmsControllerGetConfigurationTemplates
   * @summary Get algorithm configuration templates
   * @request GET:/api/planning-algorithms/configurations/templates
   */
  planningAlgorithmsControllerGetConfigurationTemplates = (
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/api/planning-algorithms/configurations/templates`,
      method: "GET",
      ...params,
    }); /**
   * @description Retrieve performance benchmarks for different algorithms
   *
   * @tags planning-algorithms
   * @name PlanningAlgorithmsControllerGetPerformanceBenchmarks
   * @summary Get algorithm performance benchmarks
   * @request GET:/api/planning-algorithms/performance/benchmarks
   */
  planningAlgorithmsControllerGetPerformanceBenchmarks = (
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/api/planning-algorithms/performance/benchmarks`,
      method: "GET",
      ...params,
    });
}
