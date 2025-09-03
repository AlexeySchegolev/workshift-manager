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
  LoginDto,
  MonthlyShiftPlanDto,
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

export class Locations<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Creates a new location with the provided information including operating hours, services, and equipment
   *
   * @tags locations
   * @name LocationsControllerCreate
   * @summary Create a new location
   * @request POST:/api/locations
   */
  locationsControllerCreate = (
    data: CreateLocationDto,
    params: RequestParams = {}
  ) =>
    this.http.request<LocationResponseDto, void>({
      path: `/api/locations`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves all locations with optional employee data and filtering
   *
   * @tags locations
   * @name LocationsControllerFindAll
   * @summary Get all locations
   * @request GET:/api/locations
   */
  locationsControllerFindAll = (
    query?: {
      /** Only return active locations */
      activeOnly?: boolean;
      /** Include employee relationships in response */
      includeEmployees?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<LocationResponseDto[], any>({
      path: `/api/locations`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * @description Retrieves a specific location by its ID with optional employee data
   *
   * @tags locations
   * @name LocationsControllerFindOne
   * @summary Get location by ID
   * @request GET:/api/locations/{id}
   */
  locationsControllerFindOne = (
    id: string,
    query?: {
      /** Include employee relationships in response */
      includeEmployees?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<LocationResponseDto, void>({
      path: `/api/locations/${id}`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * @description Deletes a location by its ID. Location must not have assigned employees.
   *
   * @tags locations
   * @name LocationsControllerRemove
   * @summary Delete location
   * @request DELETE:/api/locations/{id}
   */
  locationsControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/locations/${id}`,
      method: "DELETE",
      ...params,
    }); /**
   * @description Updates an existing location with the provided information
   *
   * @tags locations
   * @name LocationsControllerUpdate
   * @summary Update location
   * @request PATCH:/api/locations/{id}
   */
  locationsControllerUpdate = (
    id: string,
    data: UpdateLocationDto,
    params: RequestParams = {}
  ) =>
    this.http.request<LocationResponseDto, void>({
      path: `/api/locations/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
