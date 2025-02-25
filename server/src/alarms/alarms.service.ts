import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alarm } from './entities/alarm.entity';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { AlarmResponseDto } from './dto/alarm-response.dto';
import { GetAlarmsQueryDto } from './dto/get-alarms-query.dto';
import { ApiTags } from '@nestjs/swagger';
import { Sensor } from '../sensors/entities/sensor.entity';

@ApiTags('Alarms')
@Injectable()
export class AlarmsService {
  constructor(
    @InjectRepository(Alarm)
    private alarmsRepository: Repository<Alarm>,
    @InjectRepository(Sensor)
    private sensorsRepository: Repository<Sensor>,
  ) {}

  async findAll(
    query: GetAlarmsQueryDto = {},
  ): Promise<{ data: AlarmResponseDto[]; total: number }> {
    const { page = 1, limit = 10, type, sensorId } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.alarmsRepository
      .createQueryBuilder('alarm')
      .leftJoinAndSelect('alarm.visualizations', 'visualizations')
      .leftJoinAndSelect('alarm.sensor', 'sensor')
      .orderBy('alarm.timestamp', 'DESC');

    if (type) {
      queryBuilder.andWhere('alarm.type = :type', { type });
    }

    if (sensorId) {
      queryBuilder.andWhere('sensor.id = :sensorId', { sensorId });
    }

    const [alarms, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: alarms,
      total,
    };
  }

  async findOne(id: string): Promise<AlarmResponseDto> {
    const alarm = await this.alarmsRepository.findOne({
      where: { id },
      relations: ['visualizations', 'sensor'],
    });

    if (!alarm) {
      throw new NotFoundException(`Alarm with ID ${id} not found`);
    }

    return alarm;
  }

  async create(createAlarmDto: CreateAlarmDto): Promise<AlarmResponseDto> {
    const sensor = await this.sensorsRepository.findOne({
      where: { id: createAlarmDto.sensorId },
    });

    if (!sensor) {
      throw new NotFoundException(
        `Sensor with ID ${createAlarmDto.sensorId} not found`,
      );
    }

    const alarm = this.alarmsRepository.create({
      type: createAlarmDto.type,
      sensor,
    });

    return this.alarmsRepository.save(alarm);
  }

  async delete(id: string): Promise<void> {
    const result = await this.alarmsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Alarm with ID ${id} not found`);
    }
  }
}
