import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alarm } from './entities/alarm.entity';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { AlarmResponseDto } from './dto/alarm-response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Alarms')
@Injectable()
export class AlarmsService {
  constructor(
    @InjectRepository(Alarm)
    private alarmsRepository: Repository<Alarm>,
  ) {}

  async findAll(): Promise<AlarmResponseDto[]> {
    const alarms = await this.alarmsRepository.find();
    return alarms;
  }

  async findOne(id: string): Promise<AlarmResponseDto> {
    return this.alarmsRepository.findOneOrFail({ where: { id } });
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
