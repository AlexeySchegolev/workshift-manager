import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ShiftWeekdaysService } from './shift-weekdays.service';
import { CreateShiftWeekdayDto } from './dto/create-shift-weekday.dto';
import { UpdateShiftWeekdayDto } from './dto/update-shift-weekday.dto';
import { ShiftWeekdayResponseDto } from './dto/shift-weekday-response.dto';

@Controller('shift-weekdays')
export class ShiftWeekdaysController {
  constructor(private readonly shiftWeekdaysService: ShiftWeekdaysService) {}

  @Post()
  create(@Body() createShiftWeekdayDto: CreateShiftWeekdayDto): Promise<ShiftWeekdayResponseDto> {
    return this.shiftWeekdaysService.create(createShiftWeekdayDto);
  }

  @Get()
  findAll(@Query('shiftId') shiftId?: string): Promise<ShiftWeekdayResponseDto[]> {
    if (shiftId) {
      return this.shiftWeekdaysService.findByShiftId(shiftId);
    }
    return this.shiftWeekdaysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ShiftWeekdayResponseDto> {
    return this.shiftWeekdaysService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShiftWeekdayDto: UpdateShiftWeekdayDto,
  ): Promise<ShiftWeekdayResponseDto> {
    return this.shiftWeekdaysService.update(id, updateShiftWeekdayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.shiftWeekdaysService.remove(id);
  }

  @Delete('shift/:shiftId')
  removeByShiftId(@Param('shiftId') shiftId: string): Promise<void> {
    return this.shiftWeekdaysService.removeByShiftId(shiftId);
  }
}