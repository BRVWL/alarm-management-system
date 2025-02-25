import { ApiProperty } from '@nestjs/swagger';
import { AlarmType } from '../entities/alarm.entity';

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
}
