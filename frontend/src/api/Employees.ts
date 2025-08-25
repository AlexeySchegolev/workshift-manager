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
import { HttpClient, RequestParams, ContentType, HttpResponse } from "./http-client";
import { ConstraintViolationResponseDto, CreateEmployeeDto, CreateLocationDto, CreateShiftPlanDto, CreateShiftRulesDto, EmployeeResponseDto, GenerateShiftPlanDto, LocationResponseDto, OperatingHoursDto, ShiftAssignmentResponseDto, ShiftPlanResponseDto, ShiftRulesResponseDto, TimeSlotDto, UpdateEmployeeDto, UpdateLocationDto, UpdateShiftPlanDto, UpdateShiftRulesDto, ValidateShiftPlanDto } from "./data-contracts"

export class Employees<SecurityDataType = unknown> extends HttpClient<SecurityDataType>  {

            /**
 * @description Creates a new employee with the provided information
 *
 * @tags employees
 * @name EmployeesControllerCreate
 * @summary Create a new employee
 * @request POST:/api/employees
 */
employeesControllerCreate: (data: CreateEmployeeDto, params: RequestParams = {}) =>
    this.request<EmployeeResponseDto, void>({
        path: `/api/employees`,
        method: 'POST',
                body: data,                type: ContentType.Json,        format: "json",        ...params,
    }),            /**
 * @description Retrieves all employees with optional relation data
 *
 * @tags employees
 * @name EmployeesControllerFindAll
 * @summary Get all employees
 * @request GET:/api/employees
 */
employeesControllerFindAll: (query?: {
  /** Include location and shift assignment relations */
    includeRelations?: boolean,

}, params: RequestParams = {}) =>
    this.request<(EmployeeResponseDto)[], any>({
        path: `/api/employees`,
        method: 'GET',
        query: query,                                format: "json",        ...params,
    }),            /**
 * @description Retrieves all employees assigned to a specific location
 *
 * @tags employees
 * @name EmployeesControllerFindByLocation
 * @summary Get employees by location
 * @request GET:/api/employees/by-location/{locationId}
 */
employeesControllerFindByLocation: (locationId: number, params: RequestParams = {}) =>
    this.request<(EmployeeResponseDto)[], any>({
        path: `/api/employees/by-location/${locationId}`,
        method: 'GET',
                                        format: "json",        ...params,
    }),            /**
 * @description Retrieves all employees with a specific role
 *
 * @tags employees
 * @name EmployeesControllerFindByRole
 * @summary Get employees by role
 * @request GET:/api/employees/by-role/{role}
 */
employeesControllerFindByRole: (role: string, params: RequestParams = {}) =>
    this.request<(EmployeeResponseDto)[], any>({
        path: `/api/employees/by-role/${role}`,
        method: 'GET',
                                        format: "json",        ...params,
    }),            /**
 * @description Retrieves a specific employee by their UUID
 *
 * @tags employees
 * @name EmployeesControllerFindOne
 * @summary Get employee by ID
 * @request GET:/api/employees/{id}
 */
employeesControllerFindOne: (id: string, query?: {
  /** Include location and shift assignment relations */
    includeRelations?: boolean,

}, params: RequestParams = {}) =>
    this.request<EmployeeResponseDto, void>({
        path: `/api/employees/${id}`,
        method: 'GET',
        query: query,                                format: "json",        ...params,
    }),            /**
 * @description Retrieves statistics about employees by role and location
 *
 * @tags employees
 * @name EmployeesControllerGetStats
 * @summary Get employee statistics
 * @request GET:/api/employees/stats
 */
employeesControllerGetStats: (params: RequestParams = {}) =>
    this.request<{
    byLocation?: object,
    byRole?: object,
    total?: number,

}, any>({
        path: `/api/employees/stats`,
        method: 'GET',
                                        format: "json",        ...params,
    }),            /**
 * @description Deletes an employee by their UUID
 *
 * @tags employees
 * @name EmployeesControllerRemove
 * @summary Delete employee
 * @request DELETE:/api/employees/{id}
 */
employeesControllerRemove: (id: string, params: RequestParams = {}) =>
    this.request<void, void>({
        path: `/api/employees/${id}`,
        method: 'DELETE',
                                                ...params,
    }),            /**
 * @description Updates an existing employee with the provided information
 *
 * @tags employees
 * @name EmployeesControllerUpdate
 * @summary Update employee
 * @request PATCH:/api/employees/{id}
 */
employeesControllerUpdate: (id: string, data: UpdateEmployeeDto, params: RequestParams = {}) =>
    this.request<EmployeeResponseDto, void>({
        path: `/api/employees/${id}`,
        method: 'PATCH',
                body: data,                type: ContentType.Json,        format: "json",        ...params,
    }),    }
