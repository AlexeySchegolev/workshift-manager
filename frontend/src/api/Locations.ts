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
  ConstraintViolationResponseDto,
  CreateEmployeeDto,
  CreateLocationDto,
  CreateShiftPlanDto,
  CreateShiftRulesDto,
  EmployeeResponseDto,
  GenerateShiftPlanDto,
  LocationResponseDto,
  OperatingHoursDto,
  ShiftAssignmentResponseDto,
  ShiftPlanResponseDto,
  ShiftRulesResponseDto,
  TimeSlotDto,
  UpdateEmployeeDto,
  UpdateLocationDto,
  UpdateShiftPlanDto,
  UpdateShiftRulesDto,
  ValidateShiftPlanDto,
} from "./data-contracts";

export class Locations<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Activates a location, making it available for operations
   *
   * @tags locations
   * @name LocationsControllerActivate
   * @summary Activate location
   * @request POST:/api/locations/{id}/activate
   */
  locationsControllerActivate = (id: number, params: RequestParams = {}) =>
    this.http.request<LocationResponseDto, void>({
      path: `/api/locations/${id}/activate`,
      method: "POST",
      format: "json",
      ...params,
    }); /**
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
   * @description Deactivates a location, making it unavailable for new operations
   *
   * @tags locations
   * @name LocationsControllerDeactivate
   * @summary Deactivate location
   * @request POST:/api/locations/{id}/deactivate
   */
  locationsControllerDeactivate = (id: number, params: RequestParams = {}) =>
    this.http.request<LocationResponseDto, void>({
      path: `/api/locations/${id}/deactivate`,
      method: "POST",
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
   * @description Retrieves all locations in a specific city
   *
   * @tags locations
   * @name LocationsControllerFindByCity
   * @summary Get locations by city
   * @request GET:/api/locations/by-city/{city}
   */
  locationsControllerFindByCity = (city: string, params: RequestParams = {}) =>
    this.http.request<LocationResponseDto[], any>({
      path: `/api/locations/by-city/${city}`,
      method: "GET",
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
    id: number,
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
   * @description Retrieves detailed statistics for a specific location including utilization rates
   *
   * @tags locations
   * @name LocationsControllerGetLocationWithStats
   * @summary Get detailed location statistics
   * @request GET:/api/locations/{id}/stats
   */
  locationsControllerGetLocationWithStats = (
    id: number,
    params: RequestParams = {}
  ) =>
    this.http.request<
      {
        employeeCount?: number;
        equipmentCount?: number;
        serviceCount?: number;
        utilizationRate?: number;
      },
      void
    >({
      path: `/api/locations/${id}/stats`,
      method: "GET",
      format: "json",
      ...params,
    }); /**
   * @description Retrieves comprehensive statistics about locations including capacity, utilization, and distribution
   *
   * @tags locations
   * @name LocationsControllerGetStats
   * @summary Get location statistics
   * @request GET:/api/locations/stats
   */
  locationsControllerGetStats = (params: RequestParams = {}) =>
    this.http.request<
      {
        active?: number;
        byCity?: object;
        inactive?: number;
        total?: number;
        totalCapacity?: number;
        totalEmployees?: number;
        utilizationRate?: number;
      },
      any
    >({
      path: `/api/locations/stats`,
      method: "GET",
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
  locationsControllerRemove = (id: number, params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/api/locations/${id}`,
      method: "DELETE",
      ...params,
    }); /**
   * @description Search locations by name, city, or address
   *
   * @tags locations
   * @name LocationsControllerSearch
   * @summary Search locations
   * @request GET:/api/locations/search
   */
  locationsControllerSearch = (
    query: {
      /** Search query for name, city, or address */
      q: string;
    },
    params: RequestParams = {}
  ) =>
    this.http.request<LocationResponseDto[], any>({
      path: `/api/locations/search`,
      method: "GET",
      query: query,
      format: "json",
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
    id: number,
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
