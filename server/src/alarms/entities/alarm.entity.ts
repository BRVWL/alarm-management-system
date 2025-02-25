import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum AlarmType {
  MOTION = 'motion',
  SMOKE = 'smoke',
  TEMPERATURE = 'temperature',
  SOUND = 'sound',
  INTRUSION = 'intrusion',
}

@Entity()
export class Alarm {
  @PrimaryColumn('uuid')
  @ApiProperty({ description: 'The unique identifier for the alarm' })
  id: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'The timestamp of the alarm' })
  timestamp: Date;

  @Column({
    type: 'text',
    enum: AlarmType,
  })
  @ApiProperty({ description: 'The type of alarm', enum: AlarmType })
  type: AlarmType;
}
