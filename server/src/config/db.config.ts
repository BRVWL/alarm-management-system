import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Alarm } from 'src/alarms/entities/alarm.entity';
import { Visualization } from 'src/visualizations/entities/visualization.entity';
import { Sensor } from 'src/sensors/entities/sensor.entity';

/**
 * SQLite Configuration Issue and Solution:

 * Problem:
 * - The application was failing to connect to SQLite database
 * - Native SQLite bindings weren't building correctly for Node.js on M1/M2 Mac
 * 
 * Solution:
 * 1. Install SQLite via Homebrew: `brew install sqlite3`
 * 2. Set compiler flags to use Homebrew's SQLite:
 *    - LDFLAGS="-L/opt/homebrew/opt/sqlite/lib"
 *    - CPPFLAGS="-I/opt/homebrew/opt/sqlite/include"
 *    - PKG_CONFIG_PATH="/opt/homebrew/opt/sqlite/lib/pkgconfig"
 * 3. Clean install dependencies with npm instead of pnpm:
 *    - rm -rf node_modules
 *    - npm cache verify
 *    - npm install sqlite3
 * 4. Configure TypeORM to use 'sqlite' type with system SQLite
 */

export const config: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [Alarm, Visualization, Sensor],
  synchronize: true,
  autoLoadEntities: true,
};
