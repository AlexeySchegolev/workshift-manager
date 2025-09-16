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
      where: { deletedAt: null },
      relations: ['shift'],
    });
    return shiftWeekdays.map(sw => new ShiftWeekdayResponseDto(sw));
  }

  async findByShiftId(shiftId: string): Promise<ShiftWeekdayResponseDto[]> {
    const shiftWeekdays = await this.shiftWeekdayRepository.find({
      where: { shiftId, deletedAt: null },
      relations: ['shift'],
    });
    return shiftWeekdays.map(sw => new ShiftWeekdayResponseDto(sw));
  }

  async findByLocationId(locationId: string): Promise<ShiftWeekdayResponseDto[]> {
    const shiftWeekdays = await this.shiftWeekdayRepository.find({
      where: {
        deletedAt: null,
        shift: { locationId, deletedAt: null }
      },
      relations: ['shift'],
    });
    return shiftWeekdays.map(sw => new ShiftWeekdayResponseDto(sw));
  }

  async findOne(id: string): Promise<ShiftWeekdayResponseDto> {
    const shiftWeekday = await this.shiftWeekdayRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['shift'],
    });

    if (!shiftWeekday) {
      throw new NotFoundException(`ShiftWeekday with ID ${id} not found`);
    }

    return new ShiftWeekdayResponseDto(shiftWeekday);
  }

  async update(id: string, updateShiftWeekdayDto: UpdateShiftWeekdayDto): Promise<ShiftWeekdayResponseDto> {
    const shiftWeekday = await this.shiftWeekdayRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!shiftWeekday) {
      throw new NotFoundException(`ShiftWeekday with ID ${id} not found`);
    }

    Object.assign(shiftWeekday, updateShiftWeekdayDto);
    const updatedShiftWeekday = await this.shiftWeekdayRepository.save(shiftWeekday);
    return new ShiftWeekdayResponseDto(updatedShiftWeekday);
  }

  async remove(id: string): Promise<void> {
    const shiftWeekday = await this.shiftWeekdayRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!shiftWeekday) {
      throw new NotFoundException(`ShiftWeekday with ID ${id} not found`);
    }

    shiftWeekday.deletedAt = new Date();
    await this.shiftWeekdayRepository.save(shiftWeekday);
  }

  async removeByShiftId(shiftId: string): Promise<void> {
    await this.shiftWeekdayRepository.update(
      { shiftId, deletedAt: null },
      { deletedAt: new Date() }
    );
  }
}