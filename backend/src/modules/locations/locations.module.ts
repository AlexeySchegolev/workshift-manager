import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import {Employee} from "@/database/entities/employee.entity";
import {Location} from "@/database/entities/location.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Employee])
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService, TypeOrmModule],
})
export class LocationsModule {}