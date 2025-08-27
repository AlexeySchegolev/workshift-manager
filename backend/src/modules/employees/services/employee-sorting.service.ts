import { Injectable } from '@nestjs/common';
import { Employee } from '../../../database/entities/employee.entity';
import { ShiftPlanningAvailability } from '../../../database/entities/shift-planning-availability.entity';
import { AvailabilityMap } from './employee-availability.service';

export enum RolePriority {
  SHIFT_LEADER = 1,
  SPECIALIST = 2,
  ASSISTANT = 3,
  OTHER = 999
}

/**
 * Service for sorting employees based on various criteria for shift planning.
 * Implements role-based sorting, workload balancing, and fair distribution algorithms.
 */
@Injectable()
export class EmployeeSortingService {
  /**
   * Sorts employees by role with established priority
   * Order: ShiftLeader > Specialist > Assistant > Others
   * 
   * @param employees Array of employees to sort
   * @returns Sorted array of employees
   */
  sortEmployeesByRole(employees: Employee[]): Employee[] {
    // Create a copy to avoid modifying the original array
    const sortedEmployees = [...employees];
    
    // Role priority mapping (lower number = higher priority)
    const getRolePriority = (employee: Employee): number => {
      if (!employee.primaryRole) return RolePriority.OTHER;
      
      switch (employee.primaryRole.type) {
        case 'shift_leader':
          return RolePriority.SHIFT_LEADER;
        case 'specialist':
          return RolePriority.SPECIALIST;
        case 'assistant':
          return RolePriority.ASSISTANT;
        default:
          return RolePriority.OTHER;
      }
    };
    
    // Sort by role priority
    sortedEmployees.sort((a, b) => {
      const priorityA = getRolePriority(a);
      const priorityB = getRolePriority(b);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // Secondary sort: alphabetically by name for consistency
      return a.lastName.localeCompare(b.lastName);
    });
    
    return sortedEmployees;
  }
  
  /**
   * Sorts employees by role and then for varied shift distribution
   * Considers workload AND shift type rotation for variety
   * 
   * @param employees Array of employees to sort
   * @param availabilityMap Current availability map
   * @param currentShiftType Current shift type being planned
   * @returns Sorted array of employees optimized for variety
   */
  sortAndShuffleByRole(
    employees: Employee[],
    availabilityMap?: AvailabilityMap,
    currentShiftType?: string
  ): Employee[] {
    // Group employees by role
    const shiftLeaders = employees.filter(emp => emp.primaryRole?.type === 'shift_leader');
    const specialists = employees.filter(emp => emp.primaryRole?.type === 'specialist');
    const assistants = employees.filter(emp => emp.primaryRole?.type === 'assistant');
    const others = employees.filter(emp => 
      !emp.primaryRole || 
      !['shift_leader', 'specialist', 'assistant'].includes(emp.primaryRole.type)
    );
    
    // Helper function for variety-based sorting
    const sortForVariety = (employeeList: Employee[]): Employee[] => {
      if (availabilityMap && currentShiftType) {
        return [...employeeList].sort((a, b) => {
          const aAvail = availabilityMap[a.id];
          const bAvail = availabilityMap[b.id];
          
          if (!aAvail && !bAvail) return a.lastName.localeCompare(b.lastName);
          if (!aAvail) return 1;
          if (!bAvail) return -1;
          
          // 1. Priority: Variety - prefer employees who did NOT work the same shift type last
          const aLastShift = aAvail.lastShiftType;
          const bLastShift = bAvail.lastShiftType;
          
          const aSameAsLast = aLastShift === currentShiftType;
          const bSameAsLast = bLastShift === currentShiftType;
          
          if (aSameAsLast !== bSameAsLast) {
            return aSameAsLast ? 1 : -1; // Prefer different shift type
          }
          
          // 2. Priority: Workload balance - prefer less worked employees
          const aHours = aAvail.totalHoursAssigned;
          const bHours = bAvail.totalHoursAssigned;
          const aShifts = aAvail.shiftsAssigned?.length || 0;
          const bShifts = bAvail.shiftsAssigned?.length || 0;
          
          if (Math.abs(aHours - bHours) > 7) { // Only for significant differences (> 7h)
            return aHours - bHours;
          }
          
          // 3. Priority: Number of shifts
          if (aShifts !== bShifts) {
            return aShifts - bShifts;
          }
          
          // 4. Fallback: Alphabetical for consistency
          return a.lastName.localeCompare(b.lastName);
        });
      } else if (availabilityMap) {
        // Fallback without shift type information
        return [...employeeList].sort((a, b) => {
          const aAvail = availabilityMap[a.id];
          const bAvail = availabilityMap[b.id];
          
          if (!aAvail && !bAvail) return a.lastName.localeCompare(b.lastName);
          if (!aAvail) return 1;
          if (!bAvail) return -1;
          
          const aHours = aAvail.totalHoursAssigned;
          const bHours = bAvail.totalHoursAssigned;
          const aShifts = aAvail.shiftsAssigned?.length || 0;
          const bShifts = bAvail.shiftsAssigned?.length || 0;
          
          if (aHours !== bHours) return aHours - bHours;
          if (aShifts !== bShifts) return aShifts - bShifts;
          
          return a.lastName.localeCompare(b.lastName);
        });
      } else {
        // Fallback: Alphabetical sorting for consistency
        return [...employeeList].sort((a, b) => a.lastName.localeCompare(b.lastName));
      }
    };
    
    // Apply variety-based sorting to ALL roles
    const sortedShiftLeaders = sortForVariety(shiftLeaders);
    const sortedSpecialists = sortForVariety(specialists);
    const sortedAssistants = sortForVariety(assistants);
    
    // Random shuffle only for unknown/other roles
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
    
    // Combine all groups in the desired order
    return [
      ...sortedShiftLeaders,
      ...sortedSpecialists,
      ...sortedAssistants,
      ...shuffledOthers
    ];
  }

  /**
   * Special sorting for Saturday shifts - fair Saturday distribution
   * Considers all employees (from different locations) and prioritizes by saturdaysWorked
   * 
   * @param employees Array of employees to sort (including all locations for Saturdays)
   * @param availabilityMap Current availability map
   * @returns Sorted array optimized for fair Saturday distribution
   */
  sortEmployeesForSaturday(
    employees: Employee[],
    availabilityMap: AvailabilityMap
  ): Employee[] {
    console.log('=== SATURDAY SORTING ===');
    
    const shiftLeaders = employees.filter(emp => emp.primaryRole?.type === 'shift_leader');
    const specialists = employees.filter(emp => emp.primaryRole?.type === 'specialist');
    const assistants = employees.filter(emp => emp.primaryRole?.type === 'assistant');
    
    // Sorting by saturdaysWorked (ascending) - who worked fewer Saturdays comes first
    const createSaturdaySorter = (roleEmployees: Employee[]): Employee[] => {
      return roleEmployees.sort((a, b) => {
        const aAvail = availabilityMap[a.id];
        const bAvail = availabilityMap[b.id];
        
        const aSaturdays = aAvail?.saturdaysWorked || 0;
        const bSaturdays = bAvail?.saturdaysWorked || 0;
        
        // Primary: Sort by Saturday count (fewer = higher priority)
        if (aSaturdays !== bSaturdays) {
          return aSaturdays - bSaturdays;
        }
        
        // Secondary: Sort by total hours (fewer = higher priority)
        const aHours = aAvail?.totalHoursAssigned || 0;
        const bHours = bAvail?.totalHoursAssigned || 0;
        
        if (aHours !== bHours) {
          return aHours - bHours;
        }
        
        // Tertiary: Alphabetical for consistency
        return a.lastName.localeCompare(b.lastName);
      });
    };
    
    const sortedShiftLeaders = createSaturdaySorter(shiftLeaders);
    const sortedSpecialists = createSaturdaySorter(specialists);
    const sortedAssistants = createSaturdaySorter(assistants);
    
    // Debug output
    console.log('Shift Leaders for Saturday (sorted by saturdaysWorked):');
    sortedShiftLeaders.forEach(emp => {
      const avail = availabilityMap[emp.id];
      const saturdays = avail?.saturdaysWorked || 0;
      const hours = avail?.totalHoursAssigned || 0;
      const location = emp.locationId ? `Location ${emp.locationId}` : 'Location A';
      console.log(`  ${emp.lastName} (${location}): ${saturdays} Saturdays, ${hours}h`);
    });
    
    console.log('Specialists for Saturday (sorted by saturdaysWorked):');
    sortedSpecialists.forEach(emp => {
      const avail = availabilityMap[emp.id];
      const saturdays = avail?.saturdaysWorked || 0;
      const hours = avail?.totalHoursAssigned || 0;
      const location = emp.locationId ? `Location ${emp.locationId}` : 'Location A';
      console.log(`  ${emp.lastName} (${location}): ${saturdays} Saturdays, ${hours}h`);
    });
    
    console.log('Assistants for Saturday (sorted by saturdaysWorked):');
    sortedAssistants.forEach(emp => {
      const avail = availabilityMap[emp.id];
      const saturdays = avail?.saturdaysWorked || 0;
      const hours = avail?.totalHoursAssigned || 0;
      const location = emp.locationId ? `Location ${emp.locationId}` : 'Location A';
      console.log(`  ${emp.lastName} (${location}): ${saturdays} Saturdays, ${hours}h`);
    });
    
    // Order: ShiftLeader, Specialist, Assistant
    return [...sortedShiftLeaders, ...sortedSpecialists, ...sortedAssistants];
  }

  /**
   * Sort employees by workload balance (least worked first)
   * 
   * @param employees Array of employees to sort
   * @param availabilityMap Current availability map
   * @returns Employees sorted by workload (ascending)
   */
  sortByWorkload(employees: Employee[], availabilityMap: AvailabilityMap): Employee[] {
    return [...employees].sort((a, b) => {
      const aAvail = availabilityMap[a.id];
      const bAvail = availabilityMap[b.id];
      
      const aWorkload = aAvail?.workloadPercentage || 0;
      const bWorkload = bAvail?.workloadPercentage || 0;
      
      if (aWorkload !== bWorkload) {
        return aWorkload - bWorkload;
      }
      
      // Secondary: total hours
      const aHours = aAvail?.totalHoursAssigned || 0;
      const bHours = bAvail?.totalHoursAssigned || 0;
      
      if (aHours !== bHours) {
        return aHours - bHours;
      }
      
      // Fallback: alphabetical
      return a.lastName.localeCompare(b.lastName);
    });
  }

  /**
   * Sort employees by preference satisfaction (least satisfied first)
   * 
   * @param employees Array of employees to sort
   * @param availabilityMap Current availability map
   * @returns Employees sorted by preference satisfaction (ascending)
   */
  sortByPreferenceSatisfaction(employees: Employee[], availabilityMap: AvailabilityMap): Employee[] {
    return [...employees].sort((a, b) => {
      const aAvail = availabilityMap[a.id];
      const bAvail = availabilityMap[b.id];
      
      if (!aAvail && !bAvail) return a.lastName.localeCompare(b.lastName);
      if (!aAvail) return 1;
      if (!bAvail) return -1;
      
      const aTotal = aAvail.shiftsAssigned.length || 1;
      const bTotal = bAvail.shiftsAssigned.length || 1;
      
      const aRatio = aAvail.preferredShiftsAssigned / aTotal;
      const bRatio = bAvail.preferredShiftsAssigned / bTotal;
      
      if (aRatio !== bRatio) {
        return aRatio - bRatio; // Lower ratio = higher priority
      }
      
      return a.lastName.localeCompare(b.lastName);
    });
  }

  /**
   * Sort employees by constraint violations (most violated first for priority fixing)
   * 
   * @param employees Array of employees to sort
   * @param availabilityMap Current availability map
   * @returns Employees sorted by constraint violations (descending)
   */
  sortByConstraintViolations(employees: Employee[], availabilityMap: AvailabilityMap): Employee[] {
    return [...employees].sort((a, b) => {
      const aAvail = availabilityMap[a.id];
      const bAvail = availabilityMap[b.id];
      
      const aViolations = aAvail?.constraintViolations || 0;
      const bViolations = bAvail?.constraintViolations || 0;
      
      if (aViolations !== bViolations) {
        return bViolations - aViolations; // More violations = higher priority
      }
      
      return a.lastName.localeCompare(b.lastName);
    });
  }

  /**
   * Filter employees by availability for planning
   * 
   * @param employees Array of employees to filter
   * @param availabilityMap Current availability map
   * @returns Available employees only
   */
  filterAvailableEmployees(employees: Employee[], availabilityMap: AvailabilityMap): Employee[] {
    return employees.filter(emp => {
      const availability = availabilityMap[emp.id];
      return availability?.isAvailableForPlanning !== false;
    });
  }

  /**
   * Filter employees by role type
   * 
   * @param employees Array of employees to filter
   * @param roleType Role type to filter by
   * @returns Employees with matching role type
   */
  filterByRole(employees: Employee[], roleType: string): Employee[] {
    return employees.filter(emp => emp.primaryRole?.type === roleType);
  }

  /**
   * Filter employees by location
   * 
   * @param employees Array of employees to filter
   * @param locationId Location ID to filter by (null for no specific location)
   * @returns Employees with matching location
   */
  filterByLocation(employees: Employee[], locationId?: string): Employee[] {
    if (locationId === undefined) return employees;
    
    return employees.filter(emp => emp.locationId === locationId);
  }

  /**
   * Get employees with lowest Saturday work count for fair distribution
   * 
   * @param employees Array of employees to analyze
   * @param availabilityMap Current availability map
   * @param maxCount Maximum number of employees to return
   * @returns Employees with lowest Saturday work count
   */
  getEmployeesWithLowestSaturdayCount(
    employees: Employee[],
    availabilityMap: AvailabilityMap,
    maxCount?: number
  ): Employee[] {
    const sorted = this.sortEmployeesForSaturday(employees, availabilityMap);
    return maxCount ? sorted.slice(0, maxCount) : sorted;
  }

  /**
   * Balance employees across shifts by rotating order
   * 
   * @param employees Array of employees to balance
   * @param rotationSeed Seed for consistent rotation (e.g., day number)
   * @returns Rotated array of employees
   */
  rotateEmployeesForBalance(employees: Employee[], rotationSeed: number = 0): Employee[] {
    if (employees.length === 0) return employees;
    
    const rotation = rotationSeed % employees.length;
    return [...employees.slice(rotation), ...employees.slice(0, rotation)];
  }

  /**
   * Randomize employee order while preserving role grouping
   * 
   * @param employees Array of employees to shuffle
   * @param preserveRoleOrder Whether to keep role-based grouping
   * @returns Shuffled array of employees
   */
  shuffleEmployees(employees: Employee[], preserveRoleOrder: boolean = true): Employee[] {
    if (!preserveRoleOrder) {
      return [...employees].sort(() => Math.random() - 0.5);
    }
    
    // Shuffle within role groups
    const shiftLeaders = employees.filter(emp => emp.primaryRole?.type === 'shift_leader')
      .sort(() => Math.random() - 0.5);
    const specialists = employees.filter(emp => emp.primaryRole?.type === 'specialist')
      .sort(() => Math.random() - 0.5);
    const assistants = employees.filter(emp => emp.primaryRole?.type === 'assistant')
      .sort(() => Math.random() - 0.5);
    const others = employees.filter(emp => 
      !emp.primaryRole || 
      !['shift_leader', 'specialist', 'assistant'].includes(emp.primaryRole.type)
    ).sort(() => Math.random() - 0.5);
    
    return [...shiftLeaders, ...specialists, ...assistants, ...others];
  }
}