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
  ShiftPlanResponseDto,
  ShiftResponseDto,
  TimeSlotDto,
  UpdateEmployeeAbsenceDto,
  UpdateEmployeeDto,
  UpdateLocationDto,
  UpdateOrganizationDto,
  UpdateRoleDto,
  UpdateShiftDto,
  UpdateShiftPlanDto,
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
   * @description Export a single shift plan to Excel format with customizable options
   *
   * @tags shift-plans
   * @name ShiftPlansControllerExportToExcel
   * @summary Export shift plan to Excel
   * @request POST:/api/shift-plans/{id}/export/excel
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
      /** Include additional relation data in response */
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
   * @description Retrieves all shift plans for a specific location
   *
   * @tags shift-plans
   * @name ShiftPlansControllerFindByLocation
   * @summary Get shift plans by location
   * @request GET:/api/shift-plans/location/{locationId}
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
      format: "json",
      ...params,
    }); /**
   * @description Retrieves a specific shift plan for a location by year and month
   *
   * @tags shift-plans
   * @name ShiftPlansControllerFindByLocationMonthYear
   * @summary Get shift plan by location, year and month
   * @request GET:/api/shift-plans/location/{locationId}/{year}/{month}
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
      /** Include additional relation data in response */
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
    });
}
