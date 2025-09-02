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

export class Users<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags users
   * @name UsersControllerCreate
   * @summary Create a new user
   * @request POST:/api/users
   */
  usersControllerCreate = (data: CreateUserDto, params: RequestParams = {}) =>
    this.http.request<UserResponseDto, void>({
      path: `/api/users`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags users
   * @name UsersControllerFindAll
   * @summary Get all users
   * @request GET:/api/users
   */
  usersControllerFindAll = (
    query?: {
      /** Include organizations */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<UserResponseDto[], any>({
      path: `/api/users`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags users
   * @name UsersControllerFindOne
   * @summary Get user by ID
   * @request GET:/api/users/{id}
   */
  usersControllerFindOne = (
    id: string,
    query?: {
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<UserResponseDto, void>({
      path: `/api/users/${id}`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags users
   * @name UsersControllerRemove
   * @summary Delete user by ID
   * @request DELETE:/api/users/{id}
   */
  usersControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/users/${id}`,
      method: "DELETE",
      ...params,
    }); /**
   * No description
   *
   * @tags users
   * @name UsersControllerUpdate
   * @summary Update user by ID
   * @request PATCH:/api/users/{id}
   */
  usersControllerUpdate = (
    id: string,
    data: UpdateUserDto,
    params: RequestParams = {}
  ) =>
    this.http.request<UserResponseDto, void>({
      path: `/api/users/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
