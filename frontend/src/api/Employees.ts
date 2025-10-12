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

export class Employees<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Creates a new employee with the provided information
   *
   * @tags employees
   * @name EmployeesControllerCreate
   * @summary Create a new employee
   * @request POST:/api/employees
   * @secure
   */
  employeesControllerCreate = (
    data: CreateEmployeeDto,
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeResponseDto, void>({
      path: `/api/employees`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves all employees with optional relation data
   *
   * @tags employees
   * @name EmployeesControllerFindAll
   * @summary Get all employees
   * @request GET:/api/employees
   * @secure
   */
  employeesControllerFindAll = (
    query?: {
      /** Include location and role relations */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeResponseDto[], any>({
      path: `/api/employees`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves all employees for a specific location
   *
   * @tags employees
   * @name EmployeesControllerFindByLocation
   * @summary Get employees by location ID
   * @request GET:/api/employees/location/{locationId}
   * @secure
   */
  employeesControllerFindByLocation = (
    locationId: string,
    query?: {
      /** Include location and role relations */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeResponseDto[], void>({
      path: `/api/employees/location/${locationId}`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves a specific employee by their UUID
   *
   * @tags employees
   * @name EmployeesControllerFindOne
   * @summary Get employee by ID
   * @request GET:/api/employees/{id}
   * @secure
   */
  employeesControllerFindOne = (
    id: string,
    query?: {
      /** Include location and role relations */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeResponseDto, void>({
      path: `/api/employees/${id}`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * @description Deletes an employee by their UUID
   *
   * @tags employees
   * @name EmployeesControllerRemove
   * @summary Delete employee
   * @request DELETE:/api/employees/{id}
   * @secure
   */
  employeesControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/employees/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    }); /**
   * @description Updates an existing employee with the provided information
   *
   * @tags employees
   * @name EmployeesControllerUpdate
   * @summary Update employee
   * @request PATCH:/api/employees/{id}
   * @secure
   */
  employeesControllerUpdate = (
    id: string,
    data: UpdateEmployeeDto,
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeResponseDto, void>({
      path: `/api/employees/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
