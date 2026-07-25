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
    await import('../src/models/Location');
    await import('../src/models/Tour');
    await import('../src/models/SunviaEcoResortPage');
    await import('../src/models/Booking');
    await import('../src/models/BookingActivity');
    await import('../src/models/Lead');
    await import('../src/models/CustomIcon');

    console.log('Starting database synchronization...');
    await sequelize.authenticate();
    console.log('Connection to database established.');

    console.log('Synchronizing models: User, HomePage, GeneralSettings, Location, Tour, SunviaEcoResortPage, Booking, BookingActivity, Lead, CustomIcon...');
    await sequelize.sync({ alter: true });

    const { ensureJsonColumn } = await import('./ensure-json-column');
    await ensureJsonColumn(sequelize, 'page_home', 'sailor_moon_resorts_page');
    await ensureJsonColumn(sequelize, 'page_home', 'resorts_listing_page');
    await ensureJsonColumn(sequelize, 'page_home', 'award_certificate_page');
    await ensureJsonColumn(sequelize, 'general_settings', 'socialLinks');
    await ensureJsonColumn(sequelize, 'custom_icons', 'content');

    console.log('All models synchronized successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to synchronize the database:', error);
    process.exit(1);
  }
}

syncModels();
