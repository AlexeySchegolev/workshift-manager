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
   * @secure
   */
  shiftsControllerCreate = (data: CreateShiftDto, params: RequestParams = {}) =>
    this.http.request<ShiftResponseDto, void>({
      path: `/api/shifts`,
      method: "POST",
      body: data,
      secure: true,
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
   * @secure
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
      secure: true,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves all shifts for a specific location with optional filtering
   *
   * @tags shifts
   * @name ShiftsControllerFindByLocationId
   * @summary Get shifts by location ID
   * @request GET:/api/shifts/location/{locationId}
   * @secure
   */
  shiftsControllerFindByLocationId = (
    locationId: string,
    query?: {
      /** Only return active shifts */
      activeOnly?: boolean;
      /** Include related entities (organization, location, roles) */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftResponseDto[], void>({
      path: `/api/shifts/location/${locationId}`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves a specific shift by its UUID
   *
   * @tags shifts
   * @name ShiftsControllerFindOne
   * @summary Get shift by ID
   * @request GET:/api/shifts/{id}
   * @secure
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
      secure: true,
      format: "json",
      ...params,
    }); /**
   * @description Soft deletes a shift by marking it as inactive and setting deletedAt timestamp
   *
   * @tags shifts
   * @name ShiftsControllerRemove
   * @summary Delete shift (soft delete)
   * @request DELETE:/api/shifts/{id}
   * @secure
   */
  shiftsControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/shifts/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    }); /**
   * @description Updates an existing shift with validation
   *
   * @tags shifts
   * @name ShiftsControllerUpdate
   * @summary Update shift
   * @request PATCH:/api/shifts/{id}
   * @secure
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
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
