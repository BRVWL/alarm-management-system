import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Alarm } from '../../alarms/entities/alarm.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Visualizations')
@Entity()
export class Visualization {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'The unique identifier for the visualization',
    readOnly: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Column()
  @ApiProperty({
    description: 'The filename of the visualization',
    example: 'visualization.png',
  })
  filename: string;

  @Column()
  path: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'The date and time the visualization was uploaded',
    example: '2025-02-25T10:30:00Z',
  })
  uploadedAt: Date;

  @ManyToOne(() => Alarm, (alarm) => alarm.visualizations)
  @ApiProperty({
    description: 'The alarm associated with the visualization',
    type: Alarm,
  })
  alarm: Alarm;
}
