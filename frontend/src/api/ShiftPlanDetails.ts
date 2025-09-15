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
  CreateEmployeeAbsenceDto,
  CreateEmployeeDto,
  CreateLocationDto,
  CreateOrganizationDto,
  CreateRoleDto,
  CreateShiftDto,
  CreateShiftPlanDetailDto,
  CreateShiftPlanDto,
  CreateShiftRoleDto,
  CreateUserDto,
  DateRangeDto,
  EmployeeAbsenceResponseDto,
  EmployeeResponseDto,
  ExcelExportMetadataDto,
  ExcelExportOptionsDto,
  ExcelExportRequestDto,
  ExcelExportResultDto,
  LocationResponseDto,
  LoginDto,
  OperatingHoursDto,
  OrganizationResponseDto,
  RegisterDto,
  RegisterResponseDto,
  Role,
  RoleResponseDto,
  Shift,
  ShiftPlanDetailResponseDto,
  ShiftPlanResponseDto,
  ShiftResponseDto,
  ShiftRoleResponseDto,
  TimeSlotDto,
  UpdateEmployeeAbsenceDto,
  UpdateEmployeeDto,
  UpdateLocationDto,
  UpdateOrganizationDto,
  UpdateRoleDto,
  UpdateShiftDto,
  UpdateShiftPlanDetailDto,
  UpdateShiftPlanDto,
  UpdateShiftRoleDto,
  UpdateUserDto,
  UserResponseDto,
} from "./data-contracts";

export class ShiftPlanDetails<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags shift-plan-details
   * @name ShiftPlanDetailsControllerCreate
   * @summary Create a new shift plan detail
   * @request POST:/api/shift-plan-details
   */
  shiftPlanDetailsControllerCreate = (
    data: CreateShiftPlanDetailDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanDetailResponseDto, void>({
      path: `/api/shift-plan-details`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags shift-plan-details
   * @name ShiftPlanDetailsControllerFindAll
   * @summary Get all shift plan details with optional filters
   * @request GET:/api/shift-plan-details
   */
  shiftPlanDetailsControllerFindAll = (
    query?: {
      /** Filter by day (1-31) */
      day?: string;
      /** Filter by employee ID */
      employeeId?: string;
      /** Filter by month (1-12) */
      month?: string;
      /** Filter by shift ID */
      shiftId?: string;
      /** Filter by shift plan ID */
      shiftPlanId?: string;
      /** Filter by year */
      year?: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanDetailResponseDto[], any>({
      path: `/api/shift-plan-details`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags shift-plan-details
   * @name ShiftPlanDetailsControllerFindByEmployee
   * @summary Get all shift assignments for a specific employee
   * @request GET:/api/shift-plan-details/employee/{employeeId}
   */
  shiftPlanDetailsControllerFindByEmployee = (
    employeeId: string,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanDetailResponseDto[], void>({
      path: `/api/shift-plan-details/employee/${employeeId}`,
      method: "GET",
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags shift-plan-details
   * @name ShiftPlanDetailsControllerFindByMonth
   * @summary Get all shift plan details for a specific month and year
   * @request GET:/api/shift-plan-details/month/{year}/{month}
   */
  shiftPlanDetailsControllerFindByMonth = (
    year: string,
    month: string,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanDetailResponseDto[], any>({
      path: `/api/shift-plan-details/month/${year}/${month}`,
      method: "GET",
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags shift-plan-details
   * @name ShiftPlanDetailsControllerFindByShift
   * @summary Get all assignments for a specific shift
   * @request GET:/api/shift-plan-details/shift/{shiftId}
   */
  shiftPlanDetailsControllerFindByShift = (
    shiftId: string,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanDetailResponseDto[], void>({
      path: `/api/shift-plan-details/shift/${shiftId}`,
      method: "GET",
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags shift-plan-details
   * @name ShiftPlanDetailsControllerFindByShiftPlan
   * @summary Get all details for a specific shift plan
   * @request GET:/api/shift-plan-details/shift-plan/{shiftPlanId}
   */
  shiftPlanDetailsControllerFindByShiftPlan = (
    shiftPlanId: string,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanDetailResponseDto[], void>({
      path: `/api/shift-plan-details/shift-plan/${shiftPlanId}`,
      method: "GET",
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags shift-plan-details
   * @name ShiftPlanDetailsControllerFindOne
   * @summary Get a specific shift plan detail by ID
   * @request GET:/api/shift-plan-details/{id}
   */
  shiftPlanDetailsControllerFindOne = (
    id: string,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanDetailResponseDto, void>({
      path: `/api/shift-plan-details/${id}`,
      method: "GET",
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags shift-plan-details
   * @name ShiftPlanDetailsControllerRemove
   * @summary Delete a shift plan detail
   * @request DELETE:/api/shift-plan-details/{id}
   */
  shiftPlanDetailsControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/shift-plan-details/${id}`,
      method: "DELETE",
      ...params,
    }); /**
   * No description
   *
   * @tags shift-plan-details
   * @name ShiftPlanDetailsControllerUpdate
   * @summary Update a shift plan detail
   * @request PATCH:/api/shift-plan-details/{id}
   */
  shiftPlanDetailsControllerUpdate = (
    id: string,
    data: UpdateShiftPlanDetailDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanDetailResponseDto, void>({
      path: `/api/shift-plan-details/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
