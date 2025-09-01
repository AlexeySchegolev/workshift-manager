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
  AdvancedPlanningOptionsDto,
  ConstraintViolationDto,
  ConstraintViolationResponseDto,
  ConstraintWeightsDto,
  CreateEmployeeDto,
  CreateLocationDto,
  CreateOrganizationDto,
  CreateRoleDto,
  CreateShiftDto,
  CreateShiftRulesDto,
  CreateUserDto,
  DateRangeDto,
  EmployeeAvailabilityResponseDto,
  EmployeeResponseDto,
  ExcelExportMetadataDto,
  ExcelExportOptionsDto,
  ExcelExportRequestDto,
  ExcelExportResultDto,
  GenerateShiftPlanDto,
  LocationResponseDto,
  LocationStatsDto,
  MonthlyShiftPlanDto,
  OperatingHoursDto,
  OrganizationResponseDto,
  RoleResponseDto,
  ShiftAssignmentResponseDto,
  ShiftPlanResponseDto,
  ShiftResponseDto,
  ShiftRoleRequirementDto,
  ShiftRulesResponseDto,
  TimeSlotDto,
  UpdateEmployeeDto,
  UpdateLocationDto,
  UpdateOrganizationDto,
  UpdateRoleDto,
  UpdateShiftDto,
  UpdateShiftPlanDto,
  UpdateShiftRulesDto,
  UpdateUserDto,
  UserResponseDto,
  ValidateShiftPlanDto,
} from "./data-contracts";

export class Organizations<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags organizations
   * @name OrganizationsControllerCreate
   * @summary Create a new organization
   * @request POST:/api/organizations
   */
  organizationsControllerCreate = (
    data: CreateOrganizationDto,
    params: RequestParams = {}
  ) =>
    this.http.request<OrganizationResponseDto, any>({
      path: `/api/organizations`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags organizations
   * @name OrganizationsControllerFindAll
   * @summary Get all organizations
   * @request GET:/api/organizations
   */
  organizationsControllerFindAll = (
    query?: {
      /** Include related entities */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<OrganizationResponseDto[], any>({
      path: `/api/organizations`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags organizations
   * @name OrganizationsControllerFindOne
   * @summary Get organization by ID
   * @request GET:/api/organizations/{id}
   */
  organizationsControllerFindOne = (
    id: string,
    query?: {
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<OrganizationResponseDto, void>({
      path: `/api/organizations/${id}`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags organizations
   * @name OrganizationsControllerRemove
   * @summary Delete organization by ID
   * @request DELETE:/api/organizations/{id}
   */
  organizationsControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/api/organizations/${id}`,
      method: "DELETE",
      ...params,
    }); /**
   * No description
   *
   * @tags organizations
   * @name OrganizationsControllerUpdate
   * @summary Update organization by ID
   * @request PATCH:/api/organizations/{id}
   */
  organizationsControllerUpdate = (
    id: string,
    data: UpdateOrganizationDto,
    params: RequestParams = {}
  ) =>
    this.http.request<OrganizationResponseDto, any>({
      path: `/api/organizations/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
