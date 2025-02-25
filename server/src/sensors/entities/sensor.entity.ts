import { Alarm } from 'src/alarms/entities/alarm.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sensors')
export class Sensor {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'The unique identifier for the sensor',
    readOnly: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Column()
  @ApiProperty({
    description: 'The name of the sensor',
    example: 'Sensor 1',
  })
  name: string;

  @Column()
  @ApiProperty({
    description: 'The location of the sensor',
    example: 'Room 1',
  })
  location: string;

  @OneToMany(() => Alarm, (alarm) => alarm.sensor)
  @ApiProperty({
    description: 'The alarms associated with the sensor',
    type: [Alarm],
  })
  alarms: Alarm[];
}
