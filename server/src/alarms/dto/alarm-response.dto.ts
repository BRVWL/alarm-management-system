import { ApiProperty } from '@nestjs/swagger';
import { AlarmType } from '../entities/alarm.entity';
import { VisualizationResponseDto } from '../../visualizations/dto/visualization-response.dto';
import { SensorResponseDto } from '../../sensors/dto/sensor-response.dto';
export class AlarmResponseDto {
  @ApiProperty({
    description: 'The unique identifier for the alarm',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The timestamp of the alarm',
    example: '2025-02-25T10:30:00Z',
  })
  timestamp: Date;

  @ApiProperty({
    description: 'The type of alarm',
    enum: AlarmType,
    example: AlarmType.MOTION,
  })
  type: AlarmType;

  @ApiProperty({
    description: 'The ID of the sensor that triggered this alarm',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: () => SensorResponseDto,
  })
  sensor: SensorResponseDto;

  @ApiProperty({
    description: 'The visualizations associated with this alarm',
    type: () => [VisualizationResponseDto],
    required: false,
  })
  visualizations?: VisualizationResponseDto[];
}
