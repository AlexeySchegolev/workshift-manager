import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftRulesController } from './shift-rules.controller';
import { ShiftRulesService } from './shift-rules.service';
import { ShiftRules } from '@/database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShiftRules])
  ],
  controllers: [ShiftRulesController],
  providers: [ShiftRulesService],
  exports: [ShiftRulesService, TypeOrmModule],
})
export class ShiftRulesModule {}