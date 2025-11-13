const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔧 Creating admin user...\n');

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin1234', 12);

    // Create or update admin user
    const admin = await prisma.user.upsert({
      where: { email: 'beyondspace@gmail.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
      },
      create: {
        email: 'beyondspace@gmail.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created/updated successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Email: beyondspace@gmail.com');
    console.log('   Password: admin1234');
    console.log('\n🔗 Admin Panel: http://localhost:3000/admin/login\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Make sure:');
    console.log('1. Database is connected (.env.local में DATABASE_URL check करें)');
    console.log('2. Run: npm run db:push (to create tables)');
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

