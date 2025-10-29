const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addAdminUser() {
  try {
    console.log('🔧 Adding admin user to database...\n');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@beyondestates.com' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log('Email: admin@beyondestates.com');
      console.log('Password: admin123\n');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@beyondestates.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@beyondestates.com');
    console.log('Password: admin123');
    console.log('Role: ADMIN');
    console.log('User ID:', admin.id);
    console.log('\n🎉 You can now login to the admin panel!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure .env.local file exists');
    console.log('2. Check DATABASE_URL in .env.local');
    console.log('3. Make sure MySQL is running');
    console.log('4. Run: npm run db:push (to create tables)');
  } finally {
    await prisma.$disconnect();
  }
}

addAdminUser();




