import { EmployeeAbsence } from '@/database/entities/employee-absence.entity';
import { Employee } from '@/database/entities/employee.entity';
import { Location } from '@/database/entities/location.entity';
import { Organization } from '@/database/entities/organization.entity';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShiftWeekdaysService } from '../../shift-weekdays/shift-weekdays.service';
import { ShiftsService } from '../../shifts/shifts.service';
import { CalculateShiftPlanDto } from '../dto/calculate-shift-plan.dto';
import { ShiftPlanCalculationResponseDto } from '../dto/shift-plan-calculation-response.dto';
import { CalculatedShiftPlan, EmployeeDayStatus, ReducedEmployee, RoleOccupancy, ShiftOccupancy, ShiftPlanDay, ShiftPlanOptimizerService } from './shift-plan-optimizer.service';

@Injectable()
export class ShiftPlanCalculationService {
  private readonly logger = new Logger(ShiftPlanCalculationService.name);

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(EmployeeAbsence)
    private readonly employeeAbsenceRepository: Repository<EmployeeAbsence>,
    private readonly shiftsService: ShiftsService,
    private readonly shiftWeekdaysService: ShiftWeekdaysService,
    private readonly optimizer: ShiftPlanOptimizerService,
  ) {}

  async calculateShiftPlan(dto: CalculateShiftPlanDto): Promise<ShiftPlanCalculationResponseDto> {
    this.logger.log(`Berechne Schichtplan für Location ${dto.locationId}, ${dto.month}/${dto.year}`);

    // Validiere Organization und Location
    await this.validateInputs(dto);

    // Lade alle benötigten Daten
    const employees = await this.loadEmployees(dto.locationId);
    const shifts = await this.loadShifts(dto.locationId);
    const shiftWeekdays = await this.loadShiftWeekdays(dto.locationId);
    const absences = await this.loadAbsences(dto.year, dto.month);

    // Erstelle Schichtplan-Datenstruktur
    const shiftPlanData = this.buildShiftPlanData(dto, employees, shifts, shiftWeekdays, absences);

    // Führe Optimierung durch
    const optimizedDays = await this.optimizer.optimizeShiftPlan(shiftPlanData);
    const model = this.optimizer.getLastModel();

    // Konvertiere zu DTO-Format
    const daysDto = this.convertToDtoFormat(optimizedDays);

    return {
      days: daysDto,
      model,
      year: dto.year,
      month: dto.month,
      locationId: dto.locationId,
      organizationId: dto.organizationId,
    };
  }

  private async validateInputs(dto: CalculateShiftPlanDto): Promise<void> {
    const organization = await this.organizationRepository.findOne({
      where: { id: dto.organizationId }
    });
    if (!organization) {
      throw new NotFoundException(`Organization mit ID ${dto.organizationId} nicht gefunden`);
    }

    const location = await this.locationRepository.findOne({
      where: { id: dto.locationId }
    });
    if (!location) {
      throw new NotFoundException(`Location mit ID ${dto.locationId} nicht gefunden`);
    }
  }

  private async loadEmployees(locationId: string): Promise<(ReducedEmployee & { calculatedMonthlyHours: number })[]> {
    const employees = await this.employeeRepository.find({
      where: { locationId, isActive: true },
      relations: ['primaryRole', 'location']
    });

    return employees.map(emp => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      role: emp.primaryRole?.name || 'Unbekannt',
      roleId: emp.primaryRole?.id,
      location: emp.location?.name || 'Unbekannt',
      monthlyWorkHours: emp.monthlyWorkHours || 160,
      calculatedMonthlyHours: 0
    }));
  }

  private async loadShifts(locationId: string) {
    return await this.shiftsService.findByLocationId(locationId, {
      activeOnly: true,
      includeRelations: true
    });
  }

  private async loadShiftWeekdays(locationId: string) {
    return await this.shiftWeekdaysService.findByLocationId(locationId);
  }

  private async loadAbsences(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return await this.employeeAbsenceRepository.find({
      where: [
        {
          startDate: startDate,
          endDate: endDate
        }
      ],
      relations: ['employee']
    });
  }

  private buildShiftPlanData(
    dto: CalculateShiftPlanDto,
    employees: (ReducedEmployee & { calculatedMonthlyHours: number })[],
    shifts: any[],
    shiftWeekdays: any[],
    absences: any[]
  ): CalculatedShiftPlan {
    const days = this.generateDaysForMonth(dto.year, dto.month, employees, shifts, shiftWeekdays, absences);

    return {
      employees,
      days,
      year: dto.year,
      month: dto.month,
      locationId: dto.locationId
    };
  }

  private generateDaysForMonth(
    year: number,
    month: number,
    employees: (ReducedEmployee & { calculatedMonthlyHours: number })[],
    shifts: any[],
    shiftWeekdays: any[],
    absences: any[]
  ): ShiftPlanDay[] {
    const days: ShiftPlanDay[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay(); // 0 = Sonntag, 1 = Montag, etc.
      const dayKey = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;

      // Finde Schichten für diesen Wochentag
      const dayShifts = this.getShiftsForWeekday(shifts, shiftWeekdays, dayOfWeek);

      // Erstelle Mitarbeiter-Status für diesen Tag
      const employeeStatuses = this.createEmployeeStatuses(employees, date, absences);

      // Erstelle Schicht-Belegung
      const shiftOccupancy = this.createShiftOccupancy(dayShifts);

      days.push({
        date,
        dayKey,
        dayNumber: day,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isToday: this.isToday(date),
        employees: employeeStatuses,
        shiftOccupancy
      });
    }

    return days;
  }

  private getShiftsForWeekday(shifts: any[], shiftWeekdays: any[], dayOfWeek: number): any[] {
    const weekdayShifts = shiftWeekdays.filter(sw => sw.weekday === dayOfWeek);
    return shifts.filter(shift => 
      weekdayShifts.some(ws => ws.shiftId === shift.id)
    );
  }

  private createEmployeeStatuses(
    employees: (ReducedEmployee & { calculatedMonthlyHours: number })[],
    date: Date,
    absences: any[]
  ): EmployeeDayStatus[] {
    return employees.map(emp => {
      const absence = absences.find(abs => 
        abs.employee?.id === emp.id &&
        abs.startDate <= date &&
        abs.endDate >= date
      );

      return {
        employee: emp,
        assignedShift: '',
        shiftId: '',
        shiftName: '',
        absenceType: absence?.type || '',
        absenceReason: absence?.reason || '',
        isEmpty: !absence
      };
    });
  }

  private createShiftOccupancy(shifts: any[]): ShiftOccupancy[] {
    return shifts.map(shift => {
      const roleOccupancy: RoleOccupancy[] = shift.shiftRoles?.map((sr: any) => ({
        roleId: sr.role?.id,
        roleName: sr.role?.name || 'Unbekannt',
        required: sr.count || 1,
        assigned: 0,
        assignedEmployees: [],
        priority: 1
      })) || [];

      return {
        shiftId: shift.id,
        shiftName: shift.name,
        shortName: shift.shortName,
        startTime: shift.startTime,
        endTime: shift.endTime,
        requiredCount: roleOccupancy.reduce((sum, role) => sum + role.required, 0),
        assignedCount: 0,
        assignedEmployees: [],
        roleOccupancy,
        isUnderStaffed: true,
        isCorrectlyStaffed: false
      };
    });
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  private convertToDtoFormat(days: ShiftPlanDay[]): any[] {
    return days.map(day => ({
      ...day,
      employees: day.employees.map(emp => ({
        ...emp,
        employee: {
          ...emp.employee,
          calculatedMonthlyHours: (emp.employee as any).calculatedMonthlyHours || 0
        }
      }))
    }));
  }
}