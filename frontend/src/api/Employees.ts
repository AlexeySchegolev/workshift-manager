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
  CreateUserDto,
  DateRangeDto,
  EmployeeAbsenceResponseDto,
  EmployeeResponseDto,
  ExcelExportMetadataDto,
  ExcelExportOptionsDto,
  ExcelExportRequestDto,
  ExcelExportResultDto,
  LocationResponseDto,
  LocationStatsDto,
  LoginDto,
  MonthlyShiftPlanDto,
  OperatingHoursDto,
  OrganizationResponseDto,
  RegisterDto,
  RegisterResponseDto,
  RoleResponseDto,
  ShiftPlanResponseDto,
  ShiftResponseDto,
  ShiftRoleRequirementDto,
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
   */
  employeesControllerCreate = (
    data: CreateEmployeeDto,
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeResponseDto, void>({
      path: `/api/employees`,
      method: "POST",
      body: data,
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
      format: "json",
      ...params,
    }); /**
   * @description Retrieves a specific employee by their UUID
   *
   * @tags employees
   * @name EmployeesControllerFindOne
   * @summary Get employee by ID
   * @request GET:/api/employees/{id}
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
      format: "json",
      ...params,
    }); /**
   * @description Deletes an employee by their UUID
   *
   * @tags employees
   * @name EmployeesControllerRemove
   * @summary Delete employee
   * @request DELETE:/api/employees/{id}
   */
  employeesControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/employees/${id}`,
      method: "DELETE",
      ...params,
    }); /**
   * @description Updates an existing employee with the provided information
   *
   * @tags employees
   * @name EmployeesControllerUpdate
   * @summary Update employee
   * @request PATCH:/api/employees/{id}
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
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
