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
  ConstraintViolationResponseDto,
  CreateEmployeeDto,
  CreateLocationDto,
  CreateOrganizationDto,
  CreateRoleDto,
  CreateShiftPlanDto,
  CreateShiftRulesDto,
  CreateUserDto,
  EmployeeResponseDto,
  GenerateShiftPlanDto,
  LocationResponseDto,
  OperatingHoursDto,
  OrganizationResponseDto,
  RoleResponseDto,
  ShiftAssignmentResponseDto,
  ShiftPlanResponseDto,
  ShiftRulesResponseDto,
  TimeSlotDto,
  UpdateEmployeeDto,
  UpdateLocationDto,
  UpdateOrganizationDto,
  UpdateRoleDto,
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
   * @description Activates a set of shift rules, making them available for use
   *
   * @tags shift-rules
   * @name ShiftRulesControllerActivate
   * @summary Activate shift rules
   * @request POST:/api/shift-rules/{id}/activate
   */
  shiftRulesControllerActivate = (id: string, params: RequestParams = {}) =>
    this.http.request<ShiftRulesResponseDto, void>({
      path: `/api/shift-rules/${id}/activate`,
      method: "POST",
      format: "json",
      ...params,
    }); /**
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
   * @description Deactivates a set of shift rules, making them unavailable for new shift plans
   *
   * @tags shift-rules
   * @name ShiftRulesControllerDeactivate
   * @summary Deactivate shift rules
   * @request POST:/api/shift-rules/{id}/deactivate
   */
  shiftRulesControllerDeactivate = (id: string, params: RequestParams = {}) =>
    this.http.request<ShiftRulesResponseDto, void>({
      path: `/api/shift-rules/${id}/deactivate`,
      method: "POST",
      format: "json",
      ...params,
    }); /**
   * @description Retrieves all currently active shift rules
   *
   * @tags shift-rules
   * @name ShiftRulesControllerFindActive
   * @summary Get active shift rules
   * @request GET:/api/shift-rules/active
   */
  shiftRulesControllerFindActive = (params: RequestParams = {}) =>
    this.http.request<ShiftRulesResponseDto[], any>({
      path: `/api/shift-rules/active`,
      method: "GET",
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
   * @description Retrieves the default (most recent active) shift rules set
   *
   * @tags shift-rules
   * @name ShiftRulesControllerFindDefault
   * @summary Get default shift rules
   * @request GET:/api/shift-rules/default
   */
  shiftRulesControllerFindDefault = (params: RequestParams = {}) =>
    this.http.request<ShiftRulesResponseDto, void>({
      path: `/api/shift-rules/default`,
      method: "GET",
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
   * @description Retrieves statistics about shift rules including total, active, and inactive counts
   *
   * @tags shift-rules
   * @name ShiftRulesControllerGetStats
   * @summary Get shift rules statistics
   * @request GET:/api/shift-rules/stats
   */
  shiftRulesControllerGetStats = (params: RequestParams = {}) =>
    this.http.request<
      {
        active?: number;
        inactive?: number;
        mostRecentActive?: any;
        total?: number;
      },
      any
    >({
      path: `/api/shift-rules/stats`,
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
    }); /**
   * @description Validates whether a shift assignment complies with the given rules
   *
   * @tags shift-rules
   * @name ShiftRulesControllerValidateAssignment
   * @summary Validate shift assignment
   * @request POST:/api/shift-rules/validate-assignment
   */
  shiftRulesControllerValidateAssignment = (params: RequestParams = {}) =>
    this.http.request<
      {
        isValid?: boolean;
        violations?: string[];
        warnings?: string[];
      },
      void
    >({
      path: `/api/shift-rules/validate-assignment`,
      method: "POST",
      format: "json",
      ...params,
    });
}
