import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee } from '@/database/entities';
import { Location } from '@/database/entities';
import { Role } from '@/database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Location, Role])
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService, TypeOrmModule],
})
export class EmployeesModule {}