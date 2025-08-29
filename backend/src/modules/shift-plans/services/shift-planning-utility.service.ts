import { Injectable } from '@nestjs/common';

export interface WeekGroup {
  [weekNumber: string]: Date[];
}
/**
 * Utility service for shift planning operations.
 * Contains helper functions used across different shift planning services.
 */
@Injectable()
export class ShiftPlanningUtilityService {
  /**
   * Groups the days of a month by calendar weeks according to ISO-8601 standard
   * 
   * @param year The year
   * @param month The month (1-12)
   * @param daysInMonth Total days in the month
   * @returns Object mapping week numbers to arrays of dates
   */
  groupDaysByWeek(year: number, month: number, daysInMonth: number): WeekGroup {
    const weeks: WeekGroup = {};
    
    // Generate all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const weekNumber = this.getWeekNumber(date);
      
      if (!weeks[weekNumber]) {
        weeks[weekNumber] = [];
      }
      
      weeks[weekNumber].push(date);
    }
    
    return weeks;
  }
  
  /**
   * Calculates the ISO-8601 week number for a given date
   * 
   * @param date The date to calculate week number for
   * @returns Week number (1-53)
   */
  getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    // Get first day of year
    const week1 = new Date(d.getFullYear(), 0, 4);
    // Calculate full weeks to nearest Thursday
    return 1 + Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 - 3 
      + ((week1.getDay() + 6) % 7)) / 7
    );
  }
    /**
     * Formats a date into day key string format (DD.MM.YYYY)
   * 
   * @param date Date to format
   * @returns Formatted day key string
   */
  formatDayKey(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
  
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
  
  /**
   * Checks if a date is a Saturday
   * 
   * @param date Date to check
   * @returns True if Saturday, false otherwise
   */
  isSaturday(date: Date): boolean {
    return date.getDay() === 6;
  }
  
  /**
   * Checks if a date is a Sunday
   * 
   * @param date Date to check
   * @returns True if Sunday, false otherwise
   */
  isSunday(date: Date): boolean {
    return date.getDay() === 0;
  }
  
  /**
   * Gets the day of week as number (Monday = 1, Sunday = 7)
   * 
   * @param date Date to get day of week for
   * @returns Day of week number (1-7)
   */
  getDayOfWeek(date: Date): number {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 ? 7 : dayOfWeek; // Convert Sunday from 0 to 7
  }
    /**
     * Calculates total days in a month
   * 
   * @param year The year
   * @param month The month (1-12)
   * @returns Number of days in the month
   */
  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }
  
  /**
   * Gets all dates in a month
   * 
   * @param year The year
   * @param month The month (1-12)
   * @returns Array of all dates in the month
   */
  getMonthDates(year: number, month: number): Date[] {
    const daysInMonth = this.getDaysInMonth(year, month);
    const dates: Date[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month - 1, day));
    }
    
    return dates;
  }
  
  /**
   * Filters out Sundays from an array of dates
   * 
   * @param dates Array of dates to filter
   * @returns Array of dates without Sundays
   */
  filterOutSundays(dates: Date[]): Date[] {
    return dates.filter(date => !this.isSunday(date));
  }
}