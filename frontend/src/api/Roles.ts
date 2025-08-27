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
  BulkValidationRequestDto,
  ConstraintValidationResultDto,
  ConstraintViolationDto,
  ConstraintViolationResponseDto,
  ConstraintViolationsSummaryDto,
  ConstraintWeightsDto,
  CreateEmployeeDto,
  CreateLocationDto,
  CreateOrganizationDto,
  CreateRoleDto,
  CreateShiftDto,
  CreateShiftPlanDto,
  CreateShiftRulesDto,
  CreateUserDto,
  DateRangeDto,
  EmployeeResponseDto,
  EmployeeUtilizationDto,
  ExcelExportMetadataDto,
  ExcelExportOptionsDto,
  ExcelExportRequestDto,
  ExcelExportResultDto,
  GenerateShiftPlanDto,
  LocationResponseDto,
  LocationStatsDto,
  MultipleExcelExportRequestDto,
  OperatingHoursDto,
  OptimizationCriteriaDto,
  OrganizationResponseDto,
  PlanningPerformanceDto,
  QualityMetricsDto,
  RoleResponseDto,
  ShiftAssignmentResponseDto,
  ShiftDistributionDto,
  ShiftPlanResponseDto,
  ShiftPlanStatisticsDto,
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
  ValidationConfigDto,
  ValidationRecommendationDto,
  ValidationStatisticsDto,
} from "./data-contracts";

export class Roles<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags roles
   * @name RolesControllerCountByOrganization
   * @summary Anzahl Rollen pro Organisation
   * @request GET:/api/roles/organization/{organizationId}/count
   */
  rolesControllerCountByOrganization = (
    organizationId: string,
    params: RequestParams = {}
  ) =>
    this.http.request<
      {
        count?: number;
      },
      any
    >({
      path: `/api/roles/organization/${organizationId}/count`,
      method: "GET",
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerCreate
   * @summary Neue Rolle erstellen
   * @request POST:/api/roles
   */
  rolesControllerCreate = (data: CreateRoleDto, params: RequestParams = {}) =>
    this.http.request<RoleResponseDto, any>({
      path: `/api/roles`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerFindAll
   * @summary Alle Rollen abrufen
   * @request GET:/api/roles
   */
  rolesControllerFindAll = (
    query?: {
      /** Verwandte Entitäten einbeziehen */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<RoleResponseDto[], any>({
      path: `/api/roles`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerFindByOrganization
   * @summary Rollen nach Organisation abrufen
   * @request GET:/api/roles/organization/{organizationId}
   */
  rolesControllerFindByOrganization = (
    organizationId: string,
    query?: {
      /** Nur aktive Rollen */
      activeOnly?: boolean;
      /** Verwandte Entitäten einbeziehen */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<RoleResponseDto[], any>({
      path: `/api/roles/organization/${organizationId}`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerFindByType
   * @summary Rollen nach Typ und Organisation
   * @request GET:/api/roles/organization/{organizationId}/type/{type}
   */
  rolesControllerFindByType = (
    organizationId: string,
    type: string,
    params: RequestParams = {}
  ) =>
    this.http.request<RoleResponseDto[], any>({
      path: `/api/roles/organization/${organizationId}/type/${type}`,
      method: "GET",
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerFindOne
   * @summary Rolle nach ID abrufen
   * @request GET:/api/roles/{id}
   */
  rolesControllerFindOne = (
    id: string,
    query?: {
      /** Verwandte Entitäten einbeziehen */
      includeRelations?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<RoleResponseDto, void>({
      path: `/api/roles/${id}`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerHardRemove
   * @summary Rolle permanent löschen
   * @request DELETE:/api/roles/{id}/hard
   */
  rolesControllerHardRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/roles/${id}/hard`,
      method: "DELETE",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerRemove
   * @summary Rolle soft-löschen
   * @request DELETE:/api/roles/{id}
   */
  rolesControllerRemove = (id: string, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/roles/${id}`,
      method: "DELETE",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerRestore
   * @summary Gelöschte Rolle wiederherstellen
   * @request POST:/api/roles/{id}/restore
   */
  rolesControllerRestore = (id: string, params: RequestParams = {}) =>
    this.http.request<RoleResponseDto, void>({
      path: `/api/roles/${id}/restore`,
      method: "POST",
      format: "json",
      ...params,
    }); /**
   * No description
   *
   * @tags roles
   * @name RolesControllerUpdate
   * @summary Rolle aktualisieren
   * @request PATCH:/api/roles/{id}
   */
  rolesControllerUpdate = (
    id: string,
    data: UpdateRoleDto,
    params: RequestParams = {}
  ) =>
    this.http.request<RoleResponseDto, void>({
      path: `/api/roles/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
