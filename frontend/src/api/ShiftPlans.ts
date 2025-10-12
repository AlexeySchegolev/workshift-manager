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

export class ShiftPlans<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Creates a new shift plan for a specific location
   *
   * @tags shift-plans
   * @name ShiftPlansControllerCreate
   * @summary Create shift plan
   * @request POST:/api/shift-plans
   * @secure
   */
  shiftPlansControllerCreate = (
    data: CreateShiftPlanDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanResponseDto, void>({
      path: `/api/shift-plans`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * @description Export a single shift plan to Excel format with customizable options
   *
   * @tags shift-plans
   * @name ShiftPlansControllerExportToExcel
   * @summary Export shift plan to Excel
   * @request POST:/api/shift-plans/{id}/export/excel
   * @secure
   */
  shiftPlansControllerExportToExcel = (
    id: string,
    data: ExcelExportRequestDto,
    params: RequestParams = {}
  ) =>
    this.http.request<ExcelExportResultDto, void>({
      path: `/api/shift-plans/${id}/export/excel`,
      method: "POST",
      body: data,
      secure: true,
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
   * @secure
   */
  shiftPlansControllerFindAll = (
    query?: {
      /** Include additional relation data in response */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanResponseDto[], any>({
      path: `/api/shift-plans`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves all shift plans for a specific location
   *
   * @tags shift-plans
   * @name ShiftPlansControllerFindByLocation
   * @summary Get shift plans by location
   * @request GET:/api/shift-plans/location/{locationId}
   * @secure
   */
  shiftPlansControllerFindByLocation = (
    locationId: string,
    query?: {
      /** Include additional relation data in response */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanResponseDto[], any>({
      path: `/api/shift-plans/location/${locationId}`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves a specific shift plan for a location by year and month
   *
   * @tags shift-plans
   * @name ShiftPlansControllerFindByLocationMonthYear
   * @summary Get shift plan by location, year and month
   * @request GET:/api/shift-plans/location/{locationId}/{year}/{month}
   * @secure
   */
  shiftPlansControllerFindByLocationMonthYear = (
    locationId: string,
    year: number,
    month: number,
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanResponseDto, void>({
      path: `/api/shift-plans/location/${locationId}/${year}/${month}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves a specific shift plan by its UUID
   *
   * @tags shift-plans
   * @name ShiftPlansControllerFindOne
   * @summary Get shift plan by ID
   * @request GET:/api/shift-plans/{id}
   * @secure
   */
  shiftPlansControllerFindOne = (
    id: string,
    query?: {
      /** Include additional relation data in response */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<ShiftPlanResponseDto, void>({
      path: `/api/shift-plans/${id}`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * @description Deletes a shift plan by its UUID. Only unpublished plans can be deleted.
   *
   * @tags shift-plans
   * @name ShiftPlansControllerRemove
   * @summary Delete shift plan
   * @request DELETE:/api/shift-plans/{id}
   * @secure
   */
  shiftPlansControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/shift-plans/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    }); /**
   * @description Updates an existing shift plan with new data
   *
   * @tags shift-plans
   * @name ShiftPlansControllerUpdate
   * @summary Update shift plan
   * @request PATCH:/api/shift-plans/{id}
   * @secure
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
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
