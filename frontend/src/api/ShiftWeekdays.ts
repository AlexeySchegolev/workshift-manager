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
  CreateShiftWeekdayDto,
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
   * @tags ShiftWeekdays
   * @name ShiftWeekdaysControllerCreate
   * @request POST:/shift-weekdays
   */
  shiftWeekdaysControllerCreate = (
    data: CreateShiftWeekdayDto,
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/shift-weekdays`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    }); /**
   * No description
   *
   * @tags ShiftWeekdays
   * @name ShiftWeekdaysControllerFindAll
   * @request GET:/shift-weekdays
   */
  shiftWeekdaysControllerFindAll = (
    query: {
      shiftId: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/shift-weekdays`,
      method: "GET",
      query: query,
      ...params,
    }); /**
   * No description
   *
   * @tags ShiftWeekdays
   * @name ShiftWeekdaysControllerFindOne
   * @request GET:/shift-weekdays/{id}
   */
  shiftWeekdaysControllerFindOne = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/shift-weekdays/${id}`,
      method: "GET",
      ...params,
    }); /**
   * No description
   *
   * @tags ShiftWeekdays
   * @name ShiftWeekdaysControllerRemove
   * @request DELETE:/shift-weekdays/{id}
   */
  shiftWeekdaysControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/shift-weekdays/${id}`,
      method: "DELETE",
      ...params,
    }); /**
   * No description
   *
   * @tags ShiftWeekdays
   * @name ShiftWeekdaysControllerRemoveByShiftId
   * @request DELETE:/shift-weekdays/shift/{shiftId}
   */
  shiftWeekdaysControllerRemoveByShiftId = (
    shiftId: string,
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/shift-weekdays/shift/${shiftId}`,
      method: "DELETE",
      ...params,
    }); /**
   * No description
   *
   * @tags ShiftWeekdays
   * @name ShiftWeekdaysControllerUpdate
   * @request PATCH:/shift-weekdays/{id}
   */
  shiftWeekdaysControllerUpdate = (
    id: string,
    data: UpdateShiftWeekdayDto,
    params: RequestParams = {}
  ) =>
    this.http.request<void, any>({
      path: `/shift-weekdays/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
