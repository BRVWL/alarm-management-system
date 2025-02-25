import { ApiProperty } from '@nestjs/swagger';
import { Alarm } from '../../alarms/entities/alarm.entity';

export class VisualizationResponseDto {
  @ApiProperty({
    description: 'The unique identifier for the visualization',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The filename of the uploaded visualization',
    example: '1740503882678-9adbda9c-bb36-48d4-94aa-b73a540875e3.png',
  })
  filename: string;

  @ApiProperty({
    description: 'The path where the visualization can be accessed',
    example:
      '/uploads/visualizations/1740503882678-9adbda9c-bb36-48d4-94aa-b73a540875e3.png',
  })
  path: string;

  @ApiProperty({
    description: 'The timestamp when the visualization was uploaded',
    example: '2025-02-25T17:18:02.000Z',
  })
  uploadedAt: Date;

  @ApiProperty({
    description: 'The alarm associated with this visualization',
    type: () => Alarm,
  })
  alarm: Alarm;
}
