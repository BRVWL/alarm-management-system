import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

async function createAdmin() {
  // Create a new DataSource with the config
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [User],
    synchronize: true,
  });

  // Initialize the DataSource
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  // Check if admin already exists
  const existingAdmin = await userRepository.findOne({
    where: { username: 'admin' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    await dataSource.destroy();
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = userRepository.create({
    username: 'admin',
    password: hashedPassword,
  });

  await userRepository.save(admin);
  console.log('Admin user created successfully');

  await dataSource.destroy();
}

createAdmin().catch((error) => {
  console.error('Error creating admin user:', error);
  process.exit(1);
});
