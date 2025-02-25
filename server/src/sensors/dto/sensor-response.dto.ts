import { ApiProperty } from '@nestjs/swagger';
import { AlarmResponseDto } from '../../alarms/dto/alarm-response.dto';

export class SensorResponseDto {
  @ApiProperty({
    description: 'The unique identifier for the sensor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the sensor',
    example: 'Living Room Motion Sensor',
  })
  name: string;

  @ApiProperty({
    description: 'The location of the sensor',
    example: 'Living Room - North Wall',
  })
  location: string;

  @ApiProperty({
    description: 'The alarms associated with this sensor',
    type: () => [AlarmResponseDto],
    required: false,
  })
  alarms?: AlarmResponseDto[];
}
