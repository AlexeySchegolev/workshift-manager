import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShiftWeekday } from '../../database/entities/shift-weekday.entity';
import { CreateShiftWeekdayDto } from './dto/create-shift-weekday.dto';
import { UpdateShiftWeekdayDto } from './dto/update-shift-weekday.dto';
import { ShiftWeekdayResponseDto } from './dto/shift-weekday-response.dto';

@Injectable()
export class ShiftWeekdaysService {
  constructor(
    @InjectRepository(ShiftWeekday)
    private shiftWeekdayRepository: Repository<ShiftWeekday>,
  ) {}

  async create(createShiftWeekdayDto: CreateShiftWeekdayDto): Promise<ShiftWeekdayResponseDto> {
    const shiftWeekday = this.shiftWeekdayRepository.create(createShiftWeekdayDto);
    const savedShiftWeekday = await this.shiftWeekdayRepository.save(shiftWeekday);
    return new ShiftWeekdayResponseDto(savedShiftWeekday);
  }

  async findAll(): Promise<ShiftWeekdayResponseDto[]> {
    const shiftWeekdays = await this.shiftWeekdayRepository.find({
      relations: ['shift'],
    });
    return shiftWeekdays.map(sw => new ShiftWeekdayResponseDto(sw));
  }

  async findByShiftId(shiftId: string): Promise<ShiftWeekdayResponseDto[]> {
    const shiftWeekdays = await this.shiftWeekdayRepository.find({
      where: { shiftId },
      relations: ['shift'],
    });
    return shiftWeekdays.map(sw => new ShiftWeekdayResponseDto(sw));
  }

  async findByLocationId(locationId: string): Promise<ShiftWeekdayResponseDto[]> {
    const shiftWeekdays = await this.shiftWeekdayRepository.find({
      where: {
        shift: { locationId }
      },
      relations: ['shift'],
    });
    return shiftWeekdays.map(sw => new ShiftWeekdayResponseDto(sw));
  }

  async findOne(id: string): Promise<ShiftWeekdayResponseDto> {
    const shiftWeekday = await this.shiftWeekdayRepository.findOne({
      where: { id },
      relations: ['shift'],
    });

    if (!shiftWeekday) {
      throw new NotFoundException(`ShiftWeekday with ID ${id} not found`);
    }

    return new ShiftWeekdayResponseDto(shiftWeekday);
  }

  async update(id: string, updateShiftWeekdayDto: UpdateShiftWeekdayDto): Promise<ShiftWeekdayResponseDto> {
    const shiftWeekday = await this.shiftWeekdayRepository.findOne({
      where: { id },
    });

    if (!shiftWeekday) {
      throw new NotFoundException(`ShiftWeekday with ID ${id} not found`);
    }

    Object.assign(shiftWeekday, updateShiftWeekdayDto);
    const updatedShiftWeekday = await this.shiftWeekdayRepository.save(shiftWeekday);
    return new ShiftWeekdayResponseDto(updatedShiftWeekday);
  }

  async remove(id: string): Promise<void> {
    const result = await this.shiftWeekdayRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`ShiftWeekday with ID ${id} not found`);
    }
  }

  async removeByShiftId(shiftId: string): Promise<void> {
    await this.shiftWeekdayRepository.delete({ shiftId });
  }
}