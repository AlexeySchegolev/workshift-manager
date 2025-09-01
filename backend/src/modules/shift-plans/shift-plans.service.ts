import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {
    ConstraintCategory,
    ConstraintViolation,
    ViolationType
} from '@/database/entities/constraint-violation.entity';
import {CreateShiftPlanDto, GenerateShiftPlanDto, ValidateShiftPlanDto} from './dto/create-shift-plan.dto';
import {UpdateShiftPlanDto} from './dto/update-shift-plan.dto';
import {DayShiftPlan, MonthlyShiftPlan, ShiftPlan} from "@/database/entities/shift-plan.entity";
import {Employee} from "@/database/entities/employee.entity";
import {ShiftRules} from "@/database/entities/shift-rules.entity";
import {Organization} from "@/database/entities/organization.entity";
import { toDateString } from '@/common/utils/date.utils';

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
    @InjectRepository(ConstraintViolation)
    private readonly constraintViolationRepository: Repository<ConstraintViolation>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  private async getDefaultOrganization(): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { isActive: true },
      order: { createdAt: 'ASC' }
    });
    
    if (!organization) {
      throw new BadRequestException('No active organization found. Please ensure the database is properly seeded.');
    }
    
    return organization;
  }

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
      shiftRules
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
      
      // Get the default organization
      const organization = await this.getDefaultOrganization();
      
      shiftPlan = await this.create({
        organizationId: organization.id,
        name: planName,
        year: generateDto.year,
        month: generateDto.month,
        planningPeriodStart: toDateString(planningPeriodStart),
        planningPeriodEnd: toDateString(planningPeriodEnd),
        planData,
        createdBy: generateDto.createdBy
      });
    }

    // Generate statistics and validate
    const statistics = this.calculatePlanStatistics(planData, employees);
    const violations = await this.validatePlanAndCreateViolations(shiftPlan.id, planData, shiftRules);

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

    const violations = await this.validatePlanData(validateDto.planData, shiftRules);
    const statistics = this.calculatePlanStatistics(validateDto.planData, employees);

    return {
      isValid: violations.length === 0,
      violations,
      statistics
    };
  }
    private async generateMonthlyPlan(
    year: number,
    month: number,
    employees: Employee[],
    rules: ShiftRules
  ): Promise<MonthlyShiftPlan> {
    const planData: MonthlyShiftPlan = {};
    const daysInMonth = new Date(year, month - 1, 0).getDate();
    
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
    rules: ShiftRules
  ): Promise<ConstraintViolation[]> {
    // Clear existing violations for this plan
    await this.constraintViolationRepository.delete({ shiftPlanId });

    const violations = await this.validatePlanData(planData, rules);
    
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
    rules: ShiftRules
  ): Promise<ConstraintViolation[]> {
    const violations: ConstraintViolation[] = [];
    
    // Basic validation - check minimum staffing levels
    // Only process entries that look like date keys (DD.MM.YYYY format)
    const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;
    
    for (const [date, dayPlan] of Object.entries(planData)) {
      // Skip entries that are not valid date keys
      if (!datePattern.test(date) || !dayPlan || typeof dayPlan !== 'object') continue;
      
      for (const [shiftType, assignedEmployees] of Object.entries(dayPlan)) {
        // Defensive programming: ensure assignedEmployees is an array
        const employeeArray = Array.isArray(assignedEmployees) ? assignedEmployees : [];
        
        if (employeeArray.length < rules.minNursesPerShift) {
          violations.push(this.constraintViolationRepository.create({
            type: ViolationType.HARD,
            category: ConstraintCategory.STAFFING,
            ruleCode: 'MIN_STAFFING',
            ruleName: 'Minimum Staffing Requirement',
            message: `${shiftType} shift on ${date} has only ${employeeArray.length} employees, minimum required is ${rules.minNursesPerShift}`,
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
    // Only count entries that look like date keys (DD.MM.YYYY format)
    const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;
    const validDateEntries = Object.entries(planData).filter(([date]) => datePattern.test(date));
    
    const stats = {
      totalDays: validDateEntries.length,
      completeDays: 0,
      totalAssignments: 0,
      employeeWorkload: {} as Record<string, number>
    };
    
    // Initialize employee workload tracking
    employees.forEach(emp => {
      stats.employeeWorkload[emp.id] = 0;
    });
    
    // Calculate statistics
    for (const [dayPlan] of validDateEntries) {
      // Skip entries that are not valid date keys or don't have proper dayPlan structure
      if (!dayPlan || typeof dayPlan !== 'object') continue;
      
      let dayAssignments = 0;
      for (const [assignedEmployees] of Object.entries(dayPlan)) {
        // Defensive programming: ensure assignedEmployees is an array
        const employeeArray = Array.isArray(assignedEmployees) ? assignedEmployees : [];
        
        dayAssignments += employeeArray.length;
        employeeArray.forEach(empId => {
          if (typeof empId === 'string' && stats.employeeWorkload[empId] !== undefined) {
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
}