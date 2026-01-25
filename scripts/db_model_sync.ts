import dotenv from 'dotenv';
import path from 'path';

// Load .env.local file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function syncModels() {
  try {
    // Dynamic imports to ensure env vars are loaded first
    const { default: sequelize } = await import('../src/lib/db');
    // Import models to ensure they are registered
    await import('../src/models/User');
    await import('../src/models/HomePage');
    await import('../src/models/GeneralSettings');

    console.log('Starting database synchronization...');
    await sequelize.authenticate();
    console.log('Connection to database established.');

    console.log('Synchronizing models: User, HomePage, GeneralSettings...');
    await sequelize.sync({ alter: true });
    
    console.log('All models synchronized successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to synchronize the database:', error);
    process.exit(1);
  }
}

syncModels();
