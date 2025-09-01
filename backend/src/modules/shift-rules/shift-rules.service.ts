import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateShiftRulesDto} from './dto/create-shift-rules.dto';
import {UpdateShiftRulesDto} from './dto/update-shift-rules.dto';
import {ShiftRules} from "@/database/entities/shift-rules.entity";

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