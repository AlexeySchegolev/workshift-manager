import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeAbsencesService } from './employee-absences.service';
import { EmployeeAbsencesController } from './employee-absences.controller';
import { EmployeeAbsence } from '@/database/entities/employee-absence.entity';
import { Employee } from '@/database/entities/employee.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([EmployeeAbsence, Employee])
    ],
    controllers: [EmployeeAbsencesController],
    providers: [EmployeeAbsencesService],
    exports: [EmployeeAbsencesService],
})
export class EmployeeAbsencesModule {}