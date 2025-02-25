import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visualization } from './entities/visualization.entity';
import { AlarmsService } from 'src/alarms/alarms.service';
import { VisualizationResponseDto } from './dto/visualization-response.dto';

@Injectable()
export class VisualizationsService {
  constructor(
    @InjectRepository(Visualization)
    private visualizationRepository: Repository<Visualization>,
    private readonly alarmsService: AlarmsService,
  ) {}

  async findAll(): Promise<VisualizationResponseDto[]> {
    const visualizations = await this.visualizationRepository.find({
      relations: ['alarm'],
    });
    return visualizations;
  }

  async findOne(id: string): Promise<VisualizationResponseDto> {
    const visualization = await this.visualizationRepository.findOne({
      where: { id },
      relations: ['alarm'],
    });
    if (!visualization) {
      throw new NotFoundException('Visualization not found');
    }
    return visualization;
  }

  async create(
    alarmId: string,
    filename: string,
    path: string,
  ): Promise<VisualizationResponseDto> {
    const alarm = await this.alarmsService.findOne(alarmId);
    if (!alarm) {
      throw new NotFoundException('Alarm not found');
    }
    const visualization = this.visualizationRepository.create({
      alarm,
      filename,
      path,
    });
    return this.visualizationRepository.save(visualization);
  }

  async delete(id: string): Promise<void> {
    const result = await this.visualizationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Visualization not found');
    }
  }
}
