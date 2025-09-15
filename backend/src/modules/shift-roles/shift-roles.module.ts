import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftRole } from '@/database/entities/shift-role.entity';
import { ShiftRolesController } from './shift-roles.controller';
import { ShiftRolesService } from './shift-roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShiftRole])
  ],
  controllers: [ShiftRolesController],
  providers: [ShiftRolesService],
  exports: [ShiftRolesService],
})
export class ShiftRolesModule {}