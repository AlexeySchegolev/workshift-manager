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

export class ShiftWeekdays<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags shift-weekdays
   * @name ShiftWeekdaysControllerCreate
   * @request POST:/api/shift-weekdays
   * @secure
   */
  shiftWeekdaysControllerCreate = (
    data: CreateShiftWeekdayDto,
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/api/shift-weekdays`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    }); /**
   * No description
   *
   * @tags shift-weekdays
   * @name ShiftWeekdaysControllerFindAll
   * @request GET:/api/shift-weekdays
   * @secure
   */
  shiftWeekdaysControllerFindAll = (
    query: {
      locationId: string;
      shiftId: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/api/shift-weekdays`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    }); /**
   * No description
   *
   * @tags shift-weekdays
   * @name ShiftWeekdaysControllerFindOne
   * @request GET:/api/shift-weekdays/{id}
   * @secure
   */
  shiftWeekdaysControllerFindOne = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/shift-weekdays/${id}`,
      method: "GET",
      secure: true,
      ...params,
    }); /**
   * No description
   *
   * @tags shift-weekdays
   * @name ShiftWeekdaysControllerRemove
   * @request DELETE:/api/shift-weekdays/{id}
   * @secure
   */
  shiftWeekdaysControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/shift-weekdays/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    }); /**
   * No description
   *
   * @tags shift-weekdays
   * @name ShiftWeekdaysControllerRemoveByShiftId
   * @request DELETE:/api/shift-weekdays/shift/{shiftId}
   * @secure
   */
  shiftWeekdaysControllerRemoveByShiftId = (
    shiftId: string,
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/api/shift-weekdays/shift/${shiftId}`,
      method: "DELETE",
      secure: true,
      ...params,
    }); /**
   * No description
   *
   * @tags shift-weekdays
   * @name ShiftWeekdaysControllerUpdate
   * @request PATCH:/api/shift-weekdays/{id}
   * @secure
   */
  shiftWeekdaysControllerUpdate = (
    id: string,
    data: UpdateShiftWeekdayDto,
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/api/shift-weekdays/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
