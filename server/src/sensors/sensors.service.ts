import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from './entities/sensor.entity';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { SensorResponseDto } from './dto/sensor-response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Sensors')
@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(Sensor)
    private sensorsRepository: Repository<Sensor>,
  ) {}

  async findAll(): Promise<SensorResponseDto[]> {
    const sensors = await this.sensorsRepository.find({
      relations: ['alarms'],
    });
    return sensors;
  }

  async findOne(id: string): Promise<SensorResponseDto> {
    const sensor = await this.sensorsRepository.findOne({
      where: { id },
      relations: ['alarms'],
    });
    if (!sensor) {
      throw new NotFoundException(`Sensor with ID ${id} not found`);
    }
    return sensor;
  }

  async create(createSensorDto: CreateSensorDto): Promise<SensorResponseDto> {
    const sensor = this.sensorsRepository.create(createSensorDto);
    return this.sensorsRepository.save(sensor);
  }

  async update(
    id: string,
    updateSensorDto: UpdateSensorDto,
  ): Promise<SensorResponseDto> {
    const sensor = await this.findOne(id);

    // Update only the fields that are provided
    Object.assign(sensor, updateSensorDto);

    return this.sensorsRepository.save(sensor);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.sensorsRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
