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

export class ShiftPlans<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
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
    });
}
