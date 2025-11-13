const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addTestProperty() {
  try {
    console.log('🔧 Adding test property to database...\n');

    // First, get or create admin user
    let user = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!user) {
      console.log('👤 Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin1234', 12);
      user = await prisma.user.create({
        data: {
          email: 'beyondspace@gmail.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
      console.log('✅ Admin user created!');
    } else {
      console.log('✅ Admin user found!');
    }

    // Your property data
    const propertyData = {
      title: "2BHK Luxury",
      city: "Mumbai",
      area: "Andheri",
      purpose: "BUY",
      type: "COMMERCIAL",
      priceDisplay: "76543",
      price: 435678,
      size: 7890,
      beds: "5678",
      rating: 4.9,
      image: "https://unsplash.com/photos/abstract-digital-landscape-with-colorful-glowing-waves-5_ZuxsChDng",
      tag: "Ready To move",
      description: "kjnjknjkrnjkgr",
      userId: user.id,
    };

    console.log('🏠 Creating property...');
    const property = await prisma.property.create({
      data: propertyData,
    });

    console.log('✅ Property created successfully!');
    console.log('Property ID:', property.id);
    console.log('Title:', property.title);
    console.log('City:', property.city);
    console.log('Price:', property.priceDisplay);

    console.log('\n🎉 Test property added!');
    console.log('You can now see it at: http://localhost:3000');

  } catch (error) {
    console.error('❌ Error adding property:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure .env.local file exists');
    console.log('2. Check DATABASE_URL in .env.local');
    console.log('3. Make sure MySQL is running');
    console.log('4. Run: npm run db:push (to create tables)');
  } finally {
    await prisma.$disconnect();
  }
}

addTestProperty();




