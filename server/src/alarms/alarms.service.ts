import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alarm } from './entities/alarm.entity';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { AlarmResponseDto } from './dto/alarm-response.dto';
import { GetAlarmsQueryDto } from './dto/get-alarms-query.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Alarms')
@Injectable()
export class AlarmsService {
  constructor(
    @InjectRepository(Alarm)
    private alarmsRepository: Repository<Alarm>,
  ) {}

  async findAll(
    query: GetAlarmsQueryDto = {},
  ): Promise<{ data: AlarmResponseDto[]; total: number }> {
    const { page = 1, limit = 10, type } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.alarmsRepository
      .createQueryBuilder('alarm')
      .leftJoinAndSelect('alarm.visualizations', 'visualizations')
      .orderBy('alarm.timestamp', 'DESC');

    if (type) {
      queryBuilder.andWhere('alarm.type = :type', { type });
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
    return this.alarmsRepository.findOneOrFail({
      where: { id },
      relations: ['visualizations'],
    });
  }

  async create(createAlarmDto: CreateAlarmDto): Promise<AlarmResponseDto> {
    const alarm = this.alarmsRepository.create({
      type: createAlarmDto.type,
    });
    return this.alarmsRepository.save(alarm);
  }

  async delete(id: string): Promise<void> {
    await this.alarmsRepository.delete(id);
  }
}
