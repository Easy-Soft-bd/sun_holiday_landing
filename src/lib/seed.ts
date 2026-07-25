import User, { UserRole } from '@/src/models/User';
import HomePage from '@/src/models/HomePage';
import sequelize from '@/src/lib/db';

export async function seedAdmin(options?: { resetPassword?: boolean }) {
  try {
    await sequelize.sync({ alter: true }); // Ensure tables exist and match model definitions

    const adminEmail = 'admin@sunholidays.com';
    const defaultPassword = 'adminpassword123';
    const existingAdmin = await User.scope('withPassword').findOne({ where: { email: adminEmail } });

    if (existingAdmin) {
      if (options?.resetPassword) {
        existingAdmin.password = defaultPassword;
        await existingAdmin.save();
        return { message: 'Admin password reset successfully' };
      }

      console.log('Admin already exists');
      return { message: 'Admin already exists' };
    }

    await User.create({
      email: adminEmail,
      password: defaultPassword, // This will be hashed by the model hook
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
