import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import {Employee} from "@/database/entities/employee.entity";
import {Location} from "@/database/entities/location.entity";
import {Role} from "@/database/entities/role.entity";
import {EmployeeAbsence} from "@/database/entities/employee-absence.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Location, Role, EmployeeAbsence])
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService, TypeOrmModule],
})
export class EmployeesModule {}