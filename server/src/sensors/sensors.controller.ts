import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { SensorResponseDto } from './dto/sensor-response.dto';

@ApiTags('Sensors')
@ApiBearerAuth('access-token')
@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sensors' })
  @ApiResponse({
    status: 200,
    description: 'List of all sensors',
    type: [SensorResponseDto],
  })
  findAll(): Promise<SensorResponseDto[]> {
    return this.sensorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sensor by ID' })
  @ApiResponse({
    status: 200,
    description: 'The sensor',
    type: SensorResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Sensor not found' })
  async findOne(@Param('id') id: string): Promise<SensorResponseDto> {
    const sensor = await this.sensorsService.findOne(id);
    if (!sensor) {
      throw new NotFoundException(`Sensor with ID ${id} not found`);
    }
    return sensor;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new sensor' })
  @ApiResponse({
    status: 201,
    description: 'The sensor has been successfully created',
    type: SensorResponseDto,
  })
  create(@Body() createSensorDto: CreateSensorDto): Promise<SensorResponseDto> {
    return this.sensorsService.create(createSensorDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a sensor' })
  @ApiResponse({
    status: 200,
    description: 'The sensor has been successfully updated',
    type: SensorResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Sensor not found' })
  async update(
    @Param('id') id: string,
    @Body() updateSensorDto: UpdateSensorDto,
  ): Promise<SensorResponseDto> {
    const sensor = await this.sensorsService.update(id, updateSensorDto);
    if (!sensor) {
      throw new NotFoundException(`Sensor with ID ${id} not found`);
    }
    return sensor;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sensor' })
  @ApiResponse({
    status: 200,
    description: 'The sensor has been successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Sensor not found' })
  async remove(@Param('id') id: string): Promise<void> {
    const result = await this.sensorsService.remove(id);
    if (!result) {
      throw new NotFoundException(`Sensor with ID ${id} not found`);
    }
  }
}
