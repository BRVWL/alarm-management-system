import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Visualization } from '../../visualizations/entities/visualization.entity';

export enum AlarmType {
  MOTION = 'motion',
  SMOKE = 'smoke',
  TEMPERATURE = 'temperature',
  SOUND = 'sound',
  INTRUSION = 'intrusion',
}

@Entity()
export class Alarm {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'The unique identifier for the alarm',
    readOnly: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'The timestamp of the alarm',
    readOnly: true,
    example: '2025-02-25T10:30:00Z',
  })
  timestamp: Date;

  @Column({
    type: 'text',
    enum: AlarmType,
  })
  @ApiProperty({ description: 'The type of alarm', enum: AlarmType })
  type: AlarmType;

  @OneToMany(() => Visualization, (visualization) => visualization.alarm)
  visualizations: Visualization[];
}
