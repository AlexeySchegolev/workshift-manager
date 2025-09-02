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
  AuthResponseDto,
  AuthUserDto,
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
  LoginDto,
  MonthlyShiftPlanDto,
  OperatingHoursDto,
  OrganizationResponseDto,
  RegisterDto,
  RegisterResponseDto,
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

export class ShiftRules<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Creates a new set of shift rules with validation constraints
   *
   * @tags shift-rules
   * @name ShiftRulesControllerCreate
   * @summary Create new shift rules
   * @request POST:/api/shift-rules
   */
  shiftRulesControllerCreate = (
    data: CreateShiftRulesDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftRulesResponseDto, void>({
      path: `/api/shift-rules`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves all shift rules with optional filtering for active rules only
   *
   * @tags shift-rules
   * @name ShiftRulesControllerFindAll
   * @summary Get all shift rules
   * @request GET:/api/shift-rules
   */
  shiftRulesControllerFindAll = (
    query?: {
      /** Only return active shift rules */
      activeOnly?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftRulesResponseDto[], any>({
      path: `/api/shift-rules`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves a specific set of shift rules by their UUID
   *
   * @tags shift-rules
   * @name ShiftRulesControllerFindOne
   * @summary Get shift rules by ID
   * @request GET:/api/shift-rules/{id}
   */
  shiftRulesControllerFindOne = (id: string, params: RequestParams = {}) =>
    this.http.request<ShiftRulesResponseDto, void>({
      path: `/api/shift-rules/${id}`,
      method: "GET",
      format: "json",
      ...params,
    }); /**
   * @description Deletes a set of shift rules by their UUID
   *
   * @tags shift-rules
   * @name ShiftRulesControllerRemove
   * @summary Delete shift rules
   * @request DELETE:/api/shift-rules/{id}
   */
  shiftRulesControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/shift-rules/${id}`,
      method: "DELETE",
      ...params,
    }); /**
   * @description Updates an existing set of shift rules with validation
   *
   * @tags shift-rules
   * @name ShiftRulesControllerUpdate
   * @summary Update shift rules
   * @request PATCH:/api/shift-rules/{id}
   */
  shiftRulesControllerUpdate = (
    id: string,
    data: UpdateShiftRulesDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftRulesResponseDto, void>({
      path: `/api/shift-rules/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
