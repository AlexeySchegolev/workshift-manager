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

export class Organizations<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags organizations
   * @name OrganizationsControllerCreate
   * @summary Create a new organization
   * @request POST:/api/organizations
   * @secure
   */
  organizationsControllerCreate = (
    data: CreateOrganizationDto,
    params: RequestParams = {}
  ) =>
    this.http.request<OrganizationResponseDto, any>({
      path: `/api/organizations`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags organizations
   * @name OrganizationsControllerFindAll
   * @summary Get all organizations
   * @request GET:/api/organizations
   * @secure
   */
  organizationsControllerFindAll = (
    query?: {
      /** Include related entities */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<OrganizationResponseDto[], any>({
      path: `/api/organizations`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags organizations
   * @name OrganizationsControllerFindOne
   * @summary Get organization by ID
   * @request GET:/api/organizations/{id}
   * @secure
   */
  organizationsControllerFindOne = (
    id: string,
    query?: {
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<OrganizationResponseDto, void>({
      path: `/api/organizations/${id}`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags organizations
   * @name OrganizationsControllerRemove
   * @summary Delete organization by ID
   * @request DELETE:/api/organizations/{id}
   * @secure
   */
  organizationsControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/organizations/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    }); /**
   * No description
   *
   * @tags organizations
   * @name OrganizationsControllerUpdate
   * @summary Update organization by ID
   * @request PATCH:/api/organizations/{id}
   * @secure
   */
  organizationsControllerUpdate = (
    id: string,
    data: UpdateOrganizationDto,
    params: RequestParams = {}
  ) =>
    this.http.request<OrganizationResponseDto, any>({
      path: `/api/organizations/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
