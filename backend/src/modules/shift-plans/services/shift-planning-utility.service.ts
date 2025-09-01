import { Injectable } from '@nestjs/common';
/**
 * Utility service for shift planning operations.
 * Contains helper functions used across different shift planning services.
 */
@Injectable()
export class ShiftPlanningUtilityService {
    /**
     * Parses a day key string back to Date object
   * 
   * @param dayKey Day key string in DD.MM.YYYY format
   * @returns Date object
   */
  parseDayKey(dayKey: string): Date {
    const [day, month, year] = dayKey.split('.').map(Number);
    return new Date(year, month - 1, day);
  }
  
  /**
   * Checks if a date is a weekend (Saturday or Sunday)
   * 
   * @param date Date to check
   * @returns True if weekend, false otherwise
   */
  isWeekend(date: Date): boolean {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
  }
}