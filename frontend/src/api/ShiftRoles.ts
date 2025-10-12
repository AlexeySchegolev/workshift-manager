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
  CalculateShiftPlanDto,
  CreateEmployeeAbsenceDto,
  CreateEmployeeDto,
  CreateLocationDto,
  CreateOrganizationDto,
  CreateRoleDto,
  CreateShiftDto,
  CreateShiftPlanDetailDto,
  CreateShiftPlanDto,
  CreateShiftRoleDto,
  CreateShiftWeekdayDto,
  CreateUserDto,
  DateRangeDto,
  EmployeeAbsenceResponseDto,
  EmployeeDayStatusDto,
  EmployeeResponseDto,
  ExcelExportMetadataDto,
  ExcelExportOptionsDto,
  ExcelExportRequestDto,
  ExcelExportResultDto,
  LocationResponseDto,
  LoginDto,
  OperatingHoursDto,
  OptimizationModelDto,
  OrganizationResponseDto,
  ReducedEmployeeDto,
  RegisterDto,
  RegisterResponseDto,
  Role,
  RoleOccupancyDto,
  RoleResponseDto,
  Shift,
  ShiftOccupancyDto,
  ShiftPlanCalculationResponseDto,
  ShiftPlanDayDto,
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
  UpdateShiftWeekdayDto,
  UpdateUserDto,
  UserResponseDto,
} from "./data-contracts";

export class ShiftRoles<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Creates a new shift role with specified count of employees needed
   *
   * @tags shift-roles
   * @name ShiftRolesControllerCreate
   * @summary Create new shift role
   * @request POST:/api/shift-roles
   * @secure
   */
  shiftRolesControllerCreate = (
    data: CreateShiftRoleDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftRoleResponseDto, void>({
      path: `/api/shift-roles`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves all shift roles with optional filtering by shift or role
   *
   * @tags shift-roles
   * @name ShiftRolesControllerFindAll
   * @summary Get all shift roles
   * @request GET:/api/shift-roles
   * @secure
   */
  shiftRolesControllerFindAll = (
    query?: {
      /** Include related entities (shift, role) */
      includeRelations?: boolean;
      /**
       * Filter by role ID
       * @format uuid
       */
      roleId?: string;
      /**
       * Filter by shift ID
       * @format uuid
       */
      shiftId?: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftRoleResponseDto[], any>({
      path: `/api/shift-roles`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves all shift roles for a specific role
   *
   * @tags shift-roles
   * @name ShiftRolesControllerFindByRoleId
   * @summary Get shift roles by role ID
   * @request GET:/api/shift-roles/role/{roleId}
   * @secure
   */
  shiftRolesControllerFindByRoleId = (
    roleId: string,
    query?: {
      /** Include related entities (shift, role) */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftRoleResponseDto[], any>({
      path: `/api/shift-roles/role/${roleId}`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves all shift roles for a specific shift
   *
   * @tags shift-roles
   * @name ShiftRolesControllerFindByShiftId
   * @summary Get shift roles by shift ID
   * @request GET:/api/shift-roles/shift/{shiftId}
   * @secure
   */
  shiftRolesControllerFindByShiftId = (
    shiftId: string,
    query?: {
      /** Include related entities (shift, role) */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftRoleResponseDto[], any>({
      path: `/api/shift-roles/shift/${shiftId}`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves a specific shift role by its UUID
   *
   * @tags shift-roles
   * @name ShiftRolesControllerFindOne
   * @summary Get shift role by ID
   * @request GET:/api/shift-roles/{id}
   * @secure
   */
  shiftRolesControllerFindOne = (
    id: string,
    query?: {
      /** Include related entities (shift, role) */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftRoleResponseDto, void>({
      path: `/api/shift-roles/${id}`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * @description Soft deletes a shift role by setting deletedAt timestamp
   *
   * @tags shift-roles
   * @name ShiftRolesControllerRemove
   * @summary Delete shift role (soft delete)
   * @request DELETE:/api/shift-roles/{id}
   * @secure
   */
  shiftRolesControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/shift-roles/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    }); /**
   * @description Updates an existing shift role
   *
   * @tags shift-roles
   * @name ShiftRolesControllerUpdate
   * @summary Update shift role
   * @request PATCH:/api/shift-roles/{id}
   * @secure
   */
  shiftRolesControllerUpdate = (
    id: string,
    data: UpdateShiftRoleDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftRoleResponseDto, void>({
      path: `/api/shift-roles/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
