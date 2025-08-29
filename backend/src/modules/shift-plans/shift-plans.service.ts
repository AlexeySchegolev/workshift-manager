import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {DayShiftPlan, MonthlyShiftPlan, ShiftPlan} from '@/database/entities';
import {Employee} from '@/database/entities';
import {ShiftRules} from '@/database/entities';
import {ShiftAssignment} from '@/database/entities';
import {
    ConstraintCategory,
    ConstraintViolation,
    ViolationType
} from '@/database/entities/constraint-violation.entity';
import {CreateShiftPlanDto, GenerateShiftPlanDto, ValidateShiftPlanDto} from './dto/create-shift-plan.dto';
import {UpdateShiftPlanDto} from './dto/update-shift-plan.dto';

@Injectable()
export class ShiftPlansService {
  private readonly logger = new Logger(ShiftPlansService.name);

  constructor(
    @InjectRepository(ShiftPlan)
    private readonly shiftPlanRepository: Repository<ShiftPlan>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(ShiftRules)
    private readonly shiftRulesRepository: Repository<ShiftRules>,
    @InjectRepository(ShiftAssignment)
    private readonly shiftAssignmentRepository: Repository<ShiftAssignment>,
    @InjectRepository(ConstraintViolation)
    private readonly constraintViolationRepository: Repository<ConstraintViolation>,
  ) {}

  async create(createShiftPlanDto: CreateShiftPlanDto): Promise<ShiftPlan> {
    this.logger.log(`Creating new shift plan for ${createShiftPlanDto.month}/${createShiftPlanDto.year}`);

    // Check if shift plan already exists for this month/year
    const existingPlan = await this.findByMonthYear(
      createShiftPlanDto.year,
      createShiftPlanDto.month,
      false
    );
    
    if (existingPlan) {
      throw new BadRequestException(
        `Shift plan for ${createShiftPlanDto.month}/${createShiftPlanDto.year} already exists`
      );
    }

    const shiftPlan = this.shiftPlanRepository.create({
      ...createShiftPlanDto,
      isPublished: createShiftPlanDto.isPublished || false
    });

    const savedPlan = await this.shiftPlanRepository.save(shiftPlan);
    
    this.logger.log(`Shift plan created successfully with ID: ${savedPlan.id}`);
    return savedPlan;
  }

  async findAll(includeRelations: boolean = true): Promise<ShiftPlan[]> {
    this.logger.log('Retrieving all shift plans');
    
    const options = includeRelations ? {
      relations: ['assignments', 'violations'],
      order: { year: 'DESC', month: 'DESC' } as any
    } : {
      order: { year: 'DESC', month: 'DESC' } as any
    };

    return this.shiftPlanRepository.find(options);
  }

  async findOne(id: string, includeRelations: boolean = true): Promise<ShiftPlan> {
    this.logger.log(`Retrieving shift plan with ID: ${id}`);

    const options = includeRelations ? {
      where: { id },
      relations: ['assignments', 'violations']
    } : { where: { id } };

    const shiftPlan = await this.shiftPlanRepository.findOne(options);
    
    if (!shiftPlan) {
      this.logger.warn(`Shift plan with ID ${id} not found`);
      throw new NotFoundException(`Shift plan with ID ${id} not found`);
    }
    
    return shiftPlan;
  }

  async findByMonthYear(year: number, month: number, throwIfNotFound: boolean = true): Promise<ShiftPlan | null> {
    this.logger.log(`Retrieving shift plan for ${month}/${year}`);

    const shiftPlan = await this.shiftPlanRepository.findOne({
      where: { year, month },
      relations: ['assignments', 'violations']
    });
    
    if (!shiftPlan && throwIfNotFound) {
      this.logger.warn(`Shift plan for ${month}/${year} not found`);
      throw new NotFoundException(`Shift plan for ${month}/${year} not found`);
    }
    
    return shiftPlan;
  }

  async update(id: string, updateShiftPlanDto: UpdateShiftPlanDto): Promise<ShiftPlan> {
    this.logger.log(`Updating shift plan with ID: ${id}`);

    // Validate shift plan exists
    await this.findOne(id, false);

    await this.shiftPlanRepository.update(id, updateShiftPlanDto);
    const updatedPlan = await this.findOne(id);
    
    this.logger.log(`Shift plan with ID ${id} updated successfully`);
    return updatedPlan;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting shift plan with ID: ${id}`);

    const shiftPlan = await this.findOne(id, true);
    
    // Check if plan is published
    if (shiftPlan.isPublished) {
      throw new BadRequestException('Cannot delete published shift plan');
    }

    await this.shiftPlanRepository.remove(shiftPlan);
    
    this.logger.log(`Shift plan with ID ${id} deleted successfully`);
  }

  async publish(id: string): Promise<ShiftPlan> {
    this.logger.log(`Publishing shift plan with ID: ${id}`);
    
    const shiftPlan = await this.findOne(id);
    
    // Validate the plan before publishing
    if (!shiftPlan.planData || Object.keys(shiftPlan.planData).length === 0) {
      throw new BadRequestException('Cannot publish empty shift plan');
    }

    await this.shiftPlanRepository.update(id, { isPublished: true });
    return this.findOne(id);
  }

  async unpublish(id: string): Promise<ShiftPlan> {
    this.logger.log(`Unpublishing shift plan with ID: ${id}`);
    
    await this.shiftPlanRepository.update(id, { isPublished: false });
    return this.findOne(id);
  }

  async generateShiftPlan(generateDto: GenerateShiftPlanDto): Promise<{
    shiftPlan: ShiftPlan;
    statistics: any;
    violations: ConstraintViolation[];
  }> {
    this.logger.log(`Generating shift plan for ${generateDto.month}/${generateDto.year}`);

    // Get employees for planning
    const employees = generateDto.employeeIds 
      ? await this.employeeRepository.findByIds(generateDto.employeeIds)
      : await this.employeeRepository.find({ relations: ['location'] });

    // Get shift rules
    const shiftRules = generateDto.shiftRulesId
      ? await this.shiftRulesRepository.findOne({ where: { id: generateDto.shiftRulesId } })
      : await this.getDefaultShiftRules();

    if (!shiftRules) {
      throw new BadRequestException('No active shift rules found for planning');
    }

    // Generate the actual plan using simplified algorithm
    const planData = await this.generateMonthlyPlan(
      generateDto.year,
      generateDto.month,
      employees,
      shiftRules,
      generateDto.useRelaxedRules || false
    );

    // Create or update the shift plan
    let shiftPlan: ShiftPlan;
    const existingPlan = await this.findByMonthYear(generateDto.year, generateDto.month, false);
    
    if (existingPlan) {
      shiftPlan = await this.update(existingPlan.id, {
        planData,
        createdBy: generateDto.createdBy
      });
    } else {
      const planName = `Schichtplan ${generateDto.month}/${generateDto.year}`;
      const planningPeriodStart = new Date(generateDto.year, generateDto.month - 1, 1);
      const planningPeriodEnd = new Date(generateDto.year, generateDto.month, 0);
      
      shiftPlan = await this.create({
        organizationId: 'default-org-id', // TODO: Get from context/user
        name: planName,
        year: generateDto.year,
        month: generateDto.month,
        planningPeriodStart: planningPeriodStart.toISOString().split('T')[0],
        planningPeriodEnd: planningPeriodEnd.toISOString().split('T')[0],
        planData,
        createdBy: generateDto.createdBy
      });
    }

    // Generate statistics and validate
    const statistics = this.calculatePlanStatistics(planData, employees);
    const violations = await this.validatePlanAndCreateViolations(shiftPlan.id, planData, employees, shiftRules);

    this.logger.log(`Shift plan generated successfully for ${generateDto.month}/${generateDto.year}`);
    
    return {
      shiftPlan,
      statistics,
      violations
    };
  }

  async validateShiftPlan(validateDto: ValidateShiftPlanDto): Promise<{
    isValid: boolean;
    violations: ConstraintViolation[];
    statistics: any;
  }> {
    this.logger.log(`Validating shift plan for ${validateDto.month}/${validateDto.year}`);

    const employees = await this.employeeRepository.findByIds(validateDto.employeeIds);
    const shiftRules = validateDto.shiftRulesId
      ? await this.shiftRulesRepository.findOne({ where: { id: validateDto.shiftRulesId } })
      : await this.getDefaultShiftRules();

    if (!shiftRules) {
      throw new BadRequestException('No shift rules found for validation');
    }

    const violations = await this.validatePlanData(validateDto.planData, employees, shiftRules);
    const statistics = this.calculatePlanStatistics(validateDto.planData, employees);

    return {
      isValid: violations.length === 0,
      violations,
      statistics
    };
  }

  async getShiftPlanStats(): Promise<{
    total: number;
    published: number;
    unpublished: number;
    currentMonth?: ShiftPlan;
    nextMonth?: ShiftPlan;
  }> {
    this.logger.log('Generating shift plan statistics');

    const allPlans = await this.findAll(false);
    const publishedPlans = allPlans.filter(plan => plan.isPublished);
    
    const now = new Date();
    const currentMonth = allPlans.find(plan => 
      plan.year === now.getFullYear() && plan.month === now.getMonth() + 1
    );
    
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonth = allPlans.find(plan => 
      plan.year === nextMonthDate.getFullYear() && plan.month === nextMonthDate.getMonth() + 1
    );

    return {
      total: allPlans.length,
      published: publishedPlans.length,
      unpublished: allPlans.length - publishedPlans.length,
      currentMonth,
      nextMonth
    };
  }

  private async generateMonthlyPlan(
    year: number,
    month: number,
    employees: Employee[],
    rules: ShiftRules,
    useRelaxedRules: boolean
  ): Promise<MonthlyShiftPlan> {
    const planData: MonthlyShiftPlan = {};
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Simplified shift generation algorithm
    // In a real implementation, this would be much more sophisticated
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
      
      const dayPlan: DayShiftPlan = {
        'F': [], // Frühdienst (Early shift)
        'S': [], // Spätdienst (Late shift)
        'FS': [] // Früh-Spät (Early-Late)
      };
      
      // Assign employees to shifts based on simple rotation
      const availableEmployees = [...employees];
      
      // Assign minimum required staff for each shift
      if (availableEmployees.length >= rules.minNursesPerShift) {
        for (let i = 0; i < rules.minNursesPerShift; i++) {
          if (availableEmployees.length > 0) {
            const employee = availableEmployees.shift();
            dayPlan['F'].push(employee!.id);
          }
        }
      }
      
      if (availableEmployees.length >= rules.minNursesPerShift) {
        for (let i = 0; i < rules.minNursesPerShift; i++) {
          if (availableEmployees.length > 0) {
            const employee = availableEmployees.shift();
            dayPlan['S'].push(employee!.id);
          }
        }
      }
      
      planData[dateKey] = dayPlan;
    }
    
    return planData;
  }

  private async validatePlanAndCreateViolations(
    shiftPlanId: string,
    planData: MonthlyShiftPlan,
    employees: Employee[],
    rules: ShiftRules
  ): Promise<ConstraintViolation[]> {
    // Clear existing violations for this plan
    await this.constraintViolationRepository.delete({ shiftPlanId });

    const violations = await this.validatePlanData(planData, employees, rules);
    
    // Save violations to database
    for (const violation of violations) {
      await this.constraintViolationRepository.save({
        ...violation,
        shiftPlanId
      });
    }

    return violations;
  }

  private async validatePlanData(
    planData: MonthlyShiftPlan,
    employees: Employee[],
    rules: ShiftRules
  ): Promise<ConstraintViolation[]> {
    const violations: ConstraintViolation[] = [];
    
    // Basic validation - check minimum staffing levels
    for (const [date, dayPlan] of Object.entries(planData)) {
      if (!dayPlan) continue;
      
      for (const [shiftType, assignedEmployees] of Object.entries(dayPlan)) {
        if (assignedEmployees.length < rules.minNursesPerShift) {
          violations.push(this.constraintViolationRepository.create({
            type: ViolationType.HARD,
            category: ConstraintCategory.STAFFING,
            ruleCode: 'MIN_STAFFING',
            ruleName: 'Minimum Staffing Requirement',
            message: `${shiftType} shift on ${date} has only ${assignedEmployees.length} employees, minimum required is ${rules.minNursesPerShift}`,
            violationDate: new Date(date.split('.').reverse().join('-')),
            shiftType,
            severity: 5
          }));
        }
      }
    }
    
    return violations;
  }

  private calculatePlanStatistics(planData: MonthlyShiftPlan, employees: Employee[]): any {
    const stats = {
      totalDays: Object.keys(planData).length,
      completeDays: 0,
      totalAssignments: 0,
      employeeWorkload: {} as Record<string, number>
    };
    
    // Initialize employee workload tracking
    employees.forEach(emp => {
      stats.employeeWorkload[emp.id] = 0;
    });
    
    // Calculate statistics
    for (const [date, dayPlan] of Object.entries(planData)) {
      if (!dayPlan) continue;
      
      let dayAssignments = 0;
      for (const [shiftType, assignedEmployees] of Object.entries(dayPlan)) {
        dayAssignments += assignedEmployees.length;
        assignedEmployees.forEach(empId => {
          if (stats.employeeWorkload[empId] !== undefined) {
            stats.employeeWorkload[empId]++;
          }
        });
      }
      
      if (dayAssignments > 0) {
        stats.completeDays++;
      }
      
      stats.totalAssignments += dayAssignments;
    }
    
    return stats;
  }

  private async getDefaultShiftRules(): Promise<ShiftRules | null> {
    const activeRules = await this.shiftRulesRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      take: 1
    });
    
    return activeRules.length > 0 ? activeRules[0] : null;
  }

  async getEmployeesForPlan(shiftPlanId: string): Promise<Employee[]> {
    // Get all employees that are potentially available for this shift plan
    // In a more sophisticated implementation, this would filter based on
    // location, roles, availability, etc.
    return this.employeeRepository.find({
      where: { isActive: true },
      relations: ['roles', 'location']
    });
  }

  async getDetailedStatistics(shiftPlanId: string): Promise<any> {
    const shiftPlan = await this.findOne(shiftPlanId, true);
    if (!shiftPlan) {
      throw new NotFoundException(`Shift plan with ID ${shiftPlanId} not found`);
    }

    const employees = await this.getEmployeesForPlan(shiftPlanId);
    const assignments = await this.shiftAssignmentRepository.find({
      where: { shiftPlanId },
      relations: ['employee', 'shift']
    });

    const violations = await this.constraintViolationRepository.find({
      where: { shiftPlanId }
    });

    // Calculate detailed statistics
      return {
        shiftPlanId,
        totalEmployees: employees.length,
        totalAssignments: assignments.length,
        totalViolations: violations.length,
        hardViolations: violations.filter(v => v.type === ViolationType.HARD).length,
        softViolations: violations.filter(v => v.type === ViolationType.SOFT).length,
        coveragePercentage: shiftPlan.coveragePercentage,
        totalHours: shiftPlan.totalHours,
        employeeUtilization: assignments.reduce((acc, assignment) => {
            const empId = assignment.employee.id;
            acc[empId] = (acc[empId] || 0) + 1;
            return acc;
        }, {} as Record<string, number>),
        violationsByCategory: violations.reduce((acc, violation) => {
            acc[violation.category] = (acc[violation.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>),
        averageShiftsPerEmployee: employees.length > 0 ? assignments.length / employees.length : 0,
        planCompleteness: this.calculatePlanCompleteness(shiftPlan.planData)
    };
  }

  private calculatePlanCompleteness(planData: MonthlyShiftPlan): number {
    if (!planData) return 0;
    
    const totalDays = Object.keys(planData).length;
    const completeDays = Object.values(planData).filter(dayPlan => {
      if (!dayPlan) return false;
      return Object.values(dayPlan).some(shifts => shifts.length > 0);
    }).length;
    
    return totalDays > 0 ? (completeDays / totalDays) * 100 : 0;
  }
}