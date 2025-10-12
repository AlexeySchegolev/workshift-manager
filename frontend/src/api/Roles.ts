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

export class Roles<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags roles
   * @name RolesControllerCreate
   * @summary Create new role
   * @request POST:/api/roles
   * @secure
   */
  rolesControllerCreate = (data: CreateRoleDto, params: RequestParams = {}) =>
    this.http.request<RoleResponseDto, any>({
      path: `/api/roles`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerFindAll
   * @summary Get all roles
   * @request GET:/api/roles
   * @secure
   */
  rolesControllerFindAll = (
    query?: {
      /** Include related entities */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<RoleResponseDto[], any>({
      path: `/api/roles`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerFindByOrganization
   * @summary Get roles by organization
   * @request GET:/api/roles/organization/{organizationId}
   * @secure
   */
  rolesControllerFindByOrganization = (
    organizationId: string,
    query?: {
      /** Include related entities */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<RoleResponseDto[], any>({
      path: `/api/roles/organization/${organizationId}`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerFindOne
   * @summary Get role by ID
   * @request GET:/api/roles/{id}
   * @secure
   */
  rolesControllerFindOne = (
    id: string,
    query?: {
      /** Include related entities */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<RoleResponseDto, void>({
      path: `/api/roles/${id}`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerRemove
   * @summary Soft delete role
   * @request DELETE:/api/roles/{id}
   * @secure
   */
  rolesControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/roles/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerUpdate
   * @summary Update role
   * @request PATCH:/api/roles/{id}
   * @secure
   */
  rolesControllerUpdate = (
    id: string,
    data: UpdateRoleDto,
    params: RequestParams = {}
  ) =>
    this.http.request<RoleResponseDto, void>({
      path: `/api/roles/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
