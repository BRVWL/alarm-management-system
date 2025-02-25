import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alarm } from './entities/alarm.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Alarms')
@Injectable()
export class AlarmsService {
  constructor(
    @InjectRepository(Alarm)
    private alarmsRepository: Repository<Alarm>,
  ) {}

  async findAll(): Promise<Alarm[]> {
    return this.alarmsRepository.find();
  }

  async create(alarm: Alarm): Promise<Alarm> {
    return this.alarmsRepository.save(alarm);
  }
}
