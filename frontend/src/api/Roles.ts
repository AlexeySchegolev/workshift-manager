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
   */
  rolesControllerCreate = (data: CreateRoleDto, params: RequestParams = {}) =>
    this.http.request<RoleResponseDto, any>({
      path: `/api/roles`,
      method: "POST",
      body: data,
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
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerFindByOrganization
   * @summary Get roles by organization
   * @request GET:/api/roles/organization/{organizationId}
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
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerFindOne
   * @summary Get role by ID
   * @request GET:/api/roles/{id}
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
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerRemove
   * @summary Soft delete role
   * @request DELETE:/api/roles/{id}
   */
  rolesControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/roles/${id}`,
      method: "DELETE",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerUpdate
   * @summary Update role
   * @request PATCH:/api/roles/{id}
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
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
