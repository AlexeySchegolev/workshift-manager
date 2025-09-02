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
  ConstraintViolationDto,
  ConstraintViolationResponseDto,
  CreateEmployeeAbsenceDto,
  CreateEmployeeDto,
  CreateLocationDto,
  CreateOrganizationDto,
  CreateRoleDto,
  CreateShiftDto,
  CreateShiftRulesDto,
  CreateUserDto,
  DateRangeDto,
  EmployeeAbsenceResponseDto,
  EmployeeAvailabilityResponseDto,
  EmployeeResponseDto,
  ExcelExportMetadataDto,
  ExcelExportOptionsDto,
  ExcelExportRequestDto,
  ExcelExportResultDto,
  GenerateShiftPlanDto,
  LocationResponseDto,
  LocationStatsDto,
  MonthlyShiftPlanDto,
  OperatingHoursDto,
  OrganizationResponseDto,
  RoleResponseDto,
  ShiftAssignmentResponseDto,
  ShiftPlanResponseDto,
  ShiftResponseDto,
  ShiftRoleRequirementDto,
  ShiftRulesResponseDto,
  TimeSlotDto,
  UpdateEmployeeAbsenceDto,
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
} from "./data-contracts";

export class ShiftPlans<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
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
    });
}
