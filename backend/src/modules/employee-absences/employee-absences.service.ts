import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { EmployeeAbsence } from '@/database/entities/employee-absence.entity';
import { Employee } from '@/database/entities/employee.entity';
import { CreateEmployeeAbsenceDto } from './dto/create-employee-absence.dto';
import { UpdateEmployeeAbsenceDto } from './dto/update-employee-absence.dto';
import { EmployeeAbsenceResponseDto } from './dto/employee-absence-response.dto';

@Injectable()
export class EmployeeAbsencesService {
    constructor(
        @InjectRepository(EmployeeAbsence)
        private readonly absenceRepository: Repository<EmployeeAbsence>,
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
    ) {}

    async create(createDto: CreateEmployeeAbsenceDto): Promise<EmployeeAbsenceResponseDto> {
        // Validate employee exists
        const employee = await this.employeeRepository.findOne({
            where: { id: createDto.employeeId }
        });

        if (!employee) {
            throw new NotFoundException(`Employee with ID ${createDto.employeeId} not found`);
        }

        // Validate date range
        const startDate = new Date(createDto.startDate);
        const endDate = new Date(createDto.endDate);

        if (startDate > endDate) {
            throw new BadRequestException('Start date cannot be after end date');
        }

        // Check for overlapping absences
        const overlappingAbsences = await this.absenceRepository.find({
            where: {
                employeeId: createDto.employeeId,
                startDate: Between(startDate, endDate),
            }
        });

        if (overlappingAbsences.length > 0) {
            throw new BadRequestException('Employee already has absence in this date range');
        }

        const absence = this.absenceRepository.create({
            ...createDto,
            startDate,
            endDate,
        });

        const savedAbsence = await this.absenceRepository.save(absence);
        return this.mapToResponseDto(savedAbsence);
    }

    async findAll(filters?: {
        employeeId?: string;
        startDate?: string;
        endDate?: string;
        month?: number;
        year?: number;
    }): Promise<EmployeeAbsenceResponseDto[]> {
        const where: FindOptionsWhere<EmployeeAbsence> = {};

        if (filters?.employeeId) {
            where.employeeId = filters.employeeId;
        }


        if (filters?.startDate && filters?.endDate) {
            where.startDate = Between(new Date(filters.startDate), new Date(filters.endDate));
        } else if (filters?.month && filters?.year) {
            const startOfMonth = new Date(filters.year, filters.month - 1, 1);
            const endOfMonth = new Date(filters.year, filters.month, 0);
            where.startDate = Between(startOfMonth, endOfMonth);
        }

        const absences = await this.absenceRepository.find({
            where,
            relations: ['employee', 'employee.primaryRole'],
            order: { startDate: 'DESC' }
        });

        return absences.map(absence => this.mapToResponseDto(absence));
    }

    async findOne(id: string): Promise<EmployeeAbsenceResponseDto> {
        const absence = await this.absenceRepository.findOne({
            where: { id },
            relations: ['employee', 'employee.primaryRole']
        });

        if (!absence) {
            throw new NotFoundException(`Employee absence with ID ${id} not found`);
        }

        return this.mapToResponseDto(absence);
    }

    async update(id: string, updateDto: UpdateEmployeeAbsenceDto): Promise<EmployeeAbsenceResponseDto> {
        const absence = await this.absenceRepository.findOne({
            where: { id }
        });

        if (!absence) {
            throw new NotFoundException(`Employee absence with ID ${id} not found`);
        }

        // Validate date range if dates are being updated
        if (updateDto.startDate || updateDto.endDate) {
            const startDate = updateDto.startDate ? new Date(updateDto.startDate) : absence.startDate;
            const endDate = updateDto.endDate ? new Date(updateDto.endDate) : absence.endDate;

            if (startDate > endDate) {
                throw new BadRequestException('Start date cannot be after end date');
            }
        }

        Object.assign(absence, updateDto);
        const updatedAbsence = await this.absenceRepository.save(absence);

        return this.mapToResponseDto(updatedAbsence);
    }

    async remove(id: string): Promise<void> {
        const absence = await this.absenceRepository.findOne({
            where: { id }
        });

        if (!absence) {
            throw new NotFoundException(`Employee absence with ID ${id} not found`);
        }

        await this.absenceRepository.remove(absence);
    }

    async getAbsencesByEmployee(employeeId: string): Promise<EmployeeAbsenceResponseDto[]> {
        return this.findAll({ employeeId });
    }

    async getAbsencesByMonth(month: number, year: number): Promise<EmployeeAbsenceResponseDto[]> {
        return this.findAll({ month, year });
    }

    private mapToResponseDto(absence: EmployeeAbsence): EmployeeAbsenceResponseDto {
        const dto = new EmployeeAbsenceResponseDto();
        
        dto.id = absence.id;
        dto.employeeId = absence.employeeId;
        dto.startDate = absence.startDate;
        dto.endDate = absence.endDate;
        dto.absenceType = absence.absenceType;
        dto.reason = absence.reason;
        dto.notes = absence.notes;
        dto.daysCount = absence.daysCount;
        dto.hoursCount = absence.hoursCount;
        dto.isPaid = absence.isPaid;
        dto.createdBy = absence.createdBy;
        dto.updatedBy = absence.updatedBy;
        dto.createdAt = absence.createdAt;
        dto.updatedAt = absence.updatedAt;
        dto.deletedAt = absence.deletedAt;

        // Virtual fields
        dto.duration = absence.duration;
        dto.isActive = absence.isActive;

        // Related data
        if (absence.employee) {
            dto.employee = {
                id: absence.employee.id,
                firstName: absence.employee.firstName,
                lastName: absence.employee.lastName,
                employeeNumber: absence.employee.employeeNumber,
                email: absence.employee.email,
                primaryRole: absence.employee.primaryRole ? {
                    id: absence.employee.primaryRole.id,
                    name: absence.employee.primaryRole.name,
                    displayName: absence.employee.primaryRole.displayName,
                } : undefined,
            };
        }


        return dto;
    }
}