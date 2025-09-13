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
  RoleResponseDto,
  ShiftPlanDetailResponseDto,
  ShiftPlanResponseDto,
  ShiftResponseDto,
  TimeSlotDto,
  UpdateEmployeeAbsenceDto,
  UpdateEmployeeDto,
  UpdateLocationDto,
  UpdateOrganizationDto,
  UpdateRoleDto,
  UpdateShiftDto,
  UpdateShiftPlanDetailDto,
  UpdateShiftPlanDto,
  UpdateUserDto,
  UserResponseDto,
} from "./data-contracts";

export class Shifts<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Creates a new shift with validation for time ranges and staffing requirements
   *
   * @tags shifts
   * @name ShiftsControllerCreate
   * @summary Create new shift
   * @request POST:/api/shifts
   */
  shiftsControllerCreate = (data: CreateShiftDto, params: RequestParams = {}) =>
    this.http.request<ShiftResponseDto, void>({
      path: `/api/shifts`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves all shifts with optional filtering by organization, location, or active status
   *
   * @tags shifts
   * @name ShiftsControllerFindAll
   * @summary Get all shifts
   * @request GET:/api/shifts
   */
  shiftsControllerFindAll = (
    query?: {
      /** Only return active shifts */
      activeOnly?: boolean;
      /** Include related entities (organization, location, roles) */
      includeRelations?: boolean;
      /**
       * Filter by location ID
       * @format uuid
       */
      locationId?: string;
      /**
       * Filter by organization ID
       * @format uuid
       */
      organizationId?: string;
      /**
       * Filter by shift plan ID
       * @format uuid
       */
      shiftPlanId?: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftResponseDto[], any>({
      path: `/api/shifts`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves a specific shift by its UUID
   *
   * @tags shifts
   * @name ShiftsControllerFindOne
   * @summary Get shift by ID
   * @request GET:/api/shifts/{id}
   */
  shiftsControllerFindOne = (
    id: string,
    query?: {
      /** Include related entities and assignments */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftResponseDto, void>({
      path: `/api/shifts/${id}`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * @description Soft deletes a shift by marking it as inactive and setting deletedAt timestamp
   *
   * @tags shifts
   * @name ShiftsControllerRemove
   * @summary Delete shift (soft delete)
   * @request DELETE:/api/shifts/{id}
   */
  shiftsControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/shifts/${id}`,
      method: "DELETE",
      ...params,
    }); /**
   * @description Updates an existing shift with validation
   *
   * @tags shifts
   * @name ShiftsControllerUpdate
   * @summary Update shift
   * @request PATCH:/api/shifts/{id}
   */
  shiftsControllerUpdate = (
    id: string,
    data: UpdateShiftDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftResponseDto, void>({
      path: `/api/shifts/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
