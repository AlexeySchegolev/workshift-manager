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
   * @request POST:/employee-absences
   */
  employeeAbsencesControllerCreate = (
    data: CreateEmployeeAbsenceDto,
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeAbsenceResponseDto, void>({
      path: `/employee-absences`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags employee-absences
   * @name EmployeeAbsencesControllerFindAll
   * @summary Get all employee absences with optional filters
   * @request GET:/employee-absences
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
      path: `/employee-absences`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags employee-absences
   * @name EmployeeAbsencesControllerFindByEmployee
   * @summary Get all absences for a specific employee
   * @request GET:/employee-absences/employee/{employeeId}
   */
  employeeAbsencesControllerFindByEmployee = (
    employeeId: string,
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeAbsenceResponseDto[], void>({
      path: `/employee-absences/employee/${employeeId}`,
      method: "GET",
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags employee-absences
   * @name EmployeeAbsencesControllerFindByMonth
   * @summary Get all absences for a specific month and year
   * @request GET:/employee-absences/month/{year}/{month}
   */
  employeeAbsencesControllerFindByMonth = (
    year: string,
    month: string,
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeAbsenceResponseDto[], any>({
      path: `/employee-absences/month/${year}/${month}`,
      method: "GET",
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags employee-absences
   * @name EmployeeAbsencesControllerFindOne
   * @summary Get a specific employee absence by ID
   * @request GET:/employee-absences/{id}
   */
  employeeAbsencesControllerFindOne = (
    id: string,
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeAbsenceResponseDto, void>({
      path: `/employee-absences/${id}`,
      method: "GET",
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags employee-absences
   * @name EmployeeAbsencesControllerRemove
   * @summary Delete an employee absence
   * @request DELETE:/employee-absences/{id}
   */
  employeeAbsencesControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/employee-absences/${id}`,
      method: "DELETE",
      ...params,
    }); /**
   * No description
   *
   * @tags employee-absences
   * @name EmployeeAbsencesControllerUpdate
   * @summary Update an employee absence
   * @request PATCH:/employee-absences/{id}
   */
  employeeAbsencesControllerUpdate = (
    id: string,
    data: UpdateEmployeeAbsenceDto,
    params: RequestParams = {}
  ) =>
    this.http.request<EmployeeAbsenceResponseDto, void>({
      path: `/employee-absences/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
