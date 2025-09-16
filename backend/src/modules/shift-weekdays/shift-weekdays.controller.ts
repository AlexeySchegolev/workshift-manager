import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShiftWeekdaysService } from './shift-weekdays.service';
import { CreateShiftWeekdayDto } from './dto/create-shift-weekday.dto';
import { UpdateShiftWeekdayDto } from './dto/update-shift-weekday.dto';
import { ShiftWeekdayResponseDto } from './dto/shift-weekday-response.dto';

@ApiTags('shift-weekdays')
@Controller('api/shift-weekdays')
export class ShiftWeekdaysController {
  constructor(private readonly shiftWeekdaysService: ShiftWeekdaysService) {}

  @Post()
  create(@Body() createShiftWeekdayDto: CreateShiftWeekdayDto): Promise<ShiftWeekdayResponseDto> {
    return this.shiftWeekdaysService.create(createShiftWeekdayDto);
  }

  @Get()
  findAll(
    @Query('shiftId') shiftId?: string,
    @Query('locationId') locationId?: string
  ): Promise<ShiftWeekdayResponseDto[]> {
    if (shiftId) {
      return this.shiftWeekdaysService.findByShiftId(shiftId);
    }
    if (locationId) {
      return this.shiftWeekdaysService.findByLocationId(locationId);
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