import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftWeekdaysService } from './shift-weekdays.service';
import { ShiftWeekdaysController } from './shift-weekdays.controller';
import { ShiftWeekday } from '../../database/entities/shift-weekday.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShiftWeekday])],
  controllers: [ShiftWeekdaysController],
  providers: [ShiftWeekdaysService],
  exports: [ShiftWeekdaysService],
})
export class ShiftWeekdaysModule {}