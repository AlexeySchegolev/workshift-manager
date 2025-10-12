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

export class EmployeeAbsences<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags employee-absences
   * @name EmployeeAbsencesControllerCreate
   * @summary Create a new employee absence
   * @request POST:/api/employee-absences
   * @secure
   */
  employeeAbsencesControllerCreate = (
    data: CreateEmployeeAbsenceDto,
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeAbsenceResponseDto, void>({
      path: `/api/employee-absences`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags employee-absences
   * @name EmployeeAbsencesControllerFindAll
   * @summary Get all employee absences with optional filters
   * @request GET:/api/employee-absences
   * @secure
   */
  employeeAbsencesControllerFindAll = (
    query?: {
      /** Filter by employee ID */
      employeeId?: string;
      /** Filter by end date (YYYY-MM-DD) */
      endDate?: string;
      /** Filter by month (1-12) */
      month?: string;
      /** Filter by start date (YYYY-MM-DD) */
      startDate?: string;
      /** Filter by year */
      year?: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeAbsenceResponseDto[], any>({
      path: `/api/employee-absences`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags employee-absences
   * @name EmployeeAbsencesControllerFindByEmployee
   * @summary Get all absences for a specific employee
   * @request GET:/api/employee-absences/employee/{employeeId}
   * @secure
   */
  employeeAbsencesControllerFindByEmployee = (
    employeeId: string,
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeAbsenceResponseDto[], void>({
      path: `/api/employee-absences/employee/${employeeId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags employee-absences
   * @name EmployeeAbsencesControllerFindByMonth
   * @summary Get all absences for a specific month and year
   * @request GET:/api/employee-absences/month/{year}/{month}
   * @secure
   */
  employeeAbsencesControllerFindByMonth = (
    year: string,
    month: string,
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeAbsenceResponseDto[], any>({
      path: `/api/employee-absences/month/${year}/${month}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags employee-absences
   * @name EmployeeAbsencesControllerFindOne
   * @summary Get a specific employee absence by ID
   * @request GET:/api/employee-absences/{id}
   * @secure
   */
  employeeAbsencesControllerFindOne = (
    id: string,
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeAbsenceResponseDto, void>({
      path: `/api/employee-absences/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags employee-absences
   * @name EmployeeAbsencesControllerRemove
   * @summary Delete an employee absence
   * @request DELETE:/api/employee-absences/{id}
   * @secure
   */
  employeeAbsencesControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/employee-absences/${id}`,
      method: "DELETE",
      secure: true,
      ...params,
    }); /**
   * No description
   *
   * @tags employee-absences
   * @name EmployeeAbsencesControllerUpdate
   * @summary Update an employee absence
   * @request PATCH:/api/employee-absences/{id}
   * @secure
   */
  employeeAbsencesControllerUpdate = (
    id: string,
    data: UpdateEmployeeAbsenceDto,
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeAbsenceResponseDto, void>({
      path: `/api/employee-absences/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
