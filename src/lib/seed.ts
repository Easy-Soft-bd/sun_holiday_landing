import User, { UserRole } from '@/src/models/User';
import sequelize from '@/src/lib/db';

export async function seedAdmin() {
  try {
    await sequelize.sync({ alter: true }); // Ensure tables exist and match model definitions

    const adminEmail = 'admin@sunholidays.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (existingAdmin) {
      console.log('Admin already exists');
      return { message: 'Admin already exists' };
    }

    await User.create({
      email: adminEmail,
      password: 'adminpassword123', // This will be hashed by the model hook
      name: 'Super Admin',
      role: UserRole.ADMIN
    });

    console.log('Admin user created successfully');
    return { message: 'Admin user created successfully' };
  } catch (error) {
    console.error('Error seeding admin:', error);
    throw error;
  }
}
