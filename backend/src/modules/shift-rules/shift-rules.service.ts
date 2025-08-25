import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ShiftRules} from '@/database/entities';
import {CreateShiftRulesDto} from './dto/create-shift-rules.dto';
import {UpdateShiftRulesDto} from './dto/update-shift-rules.dto';

@Injectable()
export class ShiftRulesService {
  private readonly logger = new Logger(ShiftRulesService.name);

  constructor(
    @InjectRepository(ShiftRules)
    private readonly shiftRulesRepository: Repository<ShiftRules>,
  ) {}

  async create(createShiftRulesDto: CreateShiftRulesDto): Promise<ShiftRules> {
    this.logger.log('Creating new shift rules');

    // Validate rule consistency
    this.validateRuleConsistency(createShiftRulesDto);

    const shiftRules = this.shiftRulesRepository.create({
      ...createShiftRulesDto,
      isActive: createShiftRulesDto.isActive !== undefined ? createShiftRulesDto.isActive : true
    });

    const savedRules = await this.shiftRulesRepository.save(shiftRules);
    
    this.logger.log(`Shift rules created successfully with ID: ${savedRules.id}`);
    return savedRules;
  }

  async findAll(activeOnly: boolean = false): Promise<ShiftRules[]> {
    this.logger.log(`Retrieving ${activeOnly ? 'active ' : ''}shift rules`);
    
    const options = activeOnly ? {
      where: { isActive: true },
      order: { createdAt: 'DESC' } as any
    } : {
      order: { createdAt: 'DESC' } as any
    };

    return this.shiftRulesRepository.find(options);
  }

  async findOne(id: string): Promise<ShiftRules> {
    this.logger.log(`Retrieving shift rules with ID: ${id}`);

    const shiftRules = await this.shiftRulesRepository.findOne({
      where: { id }
    });
    
    if (!shiftRules) {
      this.logger.warn(`Shift rules with ID ${id} not found`);
      throw new NotFoundException(`Shift rules with ID ${id} not found`);
    }
    
    return shiftRules;
  }

  async findActive(): Promise<ShiftRules[]> {
    this.logger.log('Retrieving all active shift rules');
    
    return this.shiftRulesRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' } as any
    });
  }

  async findDefault(): Promise<ShiftRules | null> {
    this.logger.log('Retrieving default (most recent active) shift rules');
    
    const activeRules = await this.shiftRulesRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' } as any,
      take: 1
    });

    return activeRules.length > 0 ? activeRules[0] : null;
  }

  async update(id: string, updateShiftRulesDto: UpdateShiftRulesDto): Promise<ShiftRules> {
    this.logger.log(`Updating shift rules with ID: ${id}`);

    // Validate rule exists
    await this.findOne(id);

    // Validate rule consistency if updating rule values
    if (this.hasRuleUpdates(updateShiftRulesDto)) {
      const existingRules = await this.findOne(id);
      const updatedRules = { ...existingRules, ...updateShiftRulesDto };
      this.validateRuleConsistency(updatedRules);
    }

    await this.shiftRulesRepository.update(id, updateShiftRulesDto);
    const updatedRules = await this.findOne(id);
    
    this.logger.log(`Shift rules with ID ${id} updated successfully`);
    return updatedRules;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting shift rules with ID: ${id}`);

    const shiftRules = await this.findOne(id);
    await this.shiftRulesRepository.remove(shiftRules);
    
    this.logger.log(`Shift rules with ID ${id} deleted successfully`);
  }

  async activate(id: string): Promise<ShiftRules> {
    this.logger.log(`Activating shift rules with ID: ${id}`);
    
    await this.shiftRulesRepository.update(id, { isActive: true });
    return this.findOne(id);
  }

  async deactivate(id: string): Promise<ShiftRules> {
    this.logger.log(`Deactivating shift rules with ID: ${id}`);
    
    await this.shiftRulesRepository.update(id, { isActive: false });
    return this.findOne(id);
  }

  async validateShiftAssignment(
    rules: ShiftRules,
    employeeRole: string,
    shiftType: string,
    consecutiveShifts: number,
    saturdaysWorked: number,
    weeklyHours: number,
    restHoursSinceLastShift: number,
    consecutiveWorkingDays: number
  ): Promise<{
    isValid: boolean;
    violations: string[];
    warnings: string[];
  }> {
    this.logger.debug(`Validating shift assignment with rules ID: ${rules.id}`);

    const violations: string[] = [];
    const warnings: string[] = [];

    // Check consecutive same shifts
    if (consecutiveShifts > rules.maxConsecutiveSameShifts) {
      violations.push(
        `Employee has worked ${consecutiveShifts} consecutive ${shiftType} shifts, exceeding the maximum of ${rules.maxConsecutiveSameShifts}`
      );
    }

    // Check Saturday limit
    if (saturdaysWorked >= rules.maxSaturdaysPerMonth) {
      violations.push(
        `Employee has already worked ${saturdaysWorked} Saturdays this month, reaching the maximum of ${rules.maxSaturdaysPerMonth}`
      );
    }

    // Check weekly hours overflow
    if (weeklyHours > (40 + rules.weeklyHoursOverflowTolerance)) {
      violations.push(
        `Weekly hours (${weeklyHours}) exceed the tolerance limit of ${40 + rules.weeklyHoursOverflowTolerance} hours`
      );
    } else if (weeklyHours > 40) {
      warnings.push(
        `Weekly hours (${weeklyHours}) exceed 40 hours but are within tolerance`
      );
    }

    // Check rest hours between shifts
    if (restHoursSinceLastShift < rules.minRestHoursBetweenShifts) {
      violations.push(
        `Only ${restHoursSinceLastShift} hours of rest since last shift, minimum required is ${rules.minRestHoursBetweenShifts}`
      );
    }

    // Check consecutive working days
    if (consecutiveWorkingDays > rules.maxConsecutiveWorkingDays) {
      violations.push(
        `Employee has worked ${consecutiveWorkingDays} consecutive days, exceeding the maximum of ${rules.maxConsecutiveWorkingDays}`
      );
    }

    return {
      isValid: violations.length === 0,
      violations,
      warnings
    };
  }

  async getRuleStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    mostRecentActive?: ShiftRules;
  }> {
    this.logger.log('Generating shift rules statistics');

    const allRules = await this.findAll();
    const activeRules = allRules.filter(rule => rule.isActive);

  return {
        total: allRules.length,
        active: activeRules.length,
        inactive: allRules.length - activeRules.length,
        mostRecentActive: activeRules.length > 0 ? activeRules[0] : undefined
    };
  }

  private validateRuleConsistency(rules: Partial<ShiftRules>): void {
    const errors: string[] = [];

    // Validate that minimum staff requirements are reasonable
    if (rules.minNursesPerShift !== undefined && rules.minNursesPerShift < 1) {
      errors.push('Minimum nurses per shift must be at least 1');
    }

    // Validate rest hours are reasonable
    if (rules.minRestHoursBetweenShifts !== undefined && rules.minRestHoursBetweenShifts < 8) {
      errors.push('Minimum rest hours between shifts should be at least 8 hours for safety');
    }

    // Validate consecutive working days
    if (rules.maxConsecutiveWorkingDays !== undefined && rules.maxConsecutiveWorkingDays < 1) {
      errors.push('Maximum consecutive working days must be at least 1');
    }

    // Validate Saturday limits
    if (rules.maxSaturdaysPerMonth !== undefined && rules.maxSaturdaysPerMonth > 5) {
      errors.push('Maximum Saturdays per month cannot exceed 5 (there are max 5 Saturdays in a month)');
    }

    // Validate weekly hours overflow tolerance
    if (rules.weeklyHoursOverflowTolerance !== undefined && rules.weeklyHoursOverflowTolerance < 0) {
      errors.push('Weekly hours overflow tolerance cannot be negative');
    }

    if (errors.length > 0) {
      throw new BadRequestException(`Rule validation failed: ${errors.join(', ')}`);
    }
  }

  private hasRuleUpdates(updateDto: UpdateShiftRulesDto): boolean {
    const ruleFields = [
      'minNursesPerShift',
      'minNurseManagersPerShift', 
      'minHelpers',
      'maxSaturdaysPerMonth',
      'maxConsecutiveSameShifts',
      'weeklyHoursOverflowTolerance',
      'minRestHoursBetweenShifts',
      'maxConsecutiveWorkingDays'
    ];

    return ruleFields.some(field => updateDto[field] !== undefined);
  }
}