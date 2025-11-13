const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProperties() {
  try {
    console.log('🔍 Checking properties in database...\n');

    // Check if there are any properties
    const propertyCount = await prisma.property.count();
    console.log(`📊 Total properties in database: ${propertyCount}`);

    if (propertyCount === 0) {
      console.log('❌ No properties found in database!');
      console.log('\n🔧 Let\'s add some properties...');
      
      // Add sample properties
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin1234', 12);
      
      // Create admin user if not exists
      let user = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: 'beyondspace@gmail.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
          },
        });
        console.log('✅ Created admin user');
      }

      // Add sample properties
      const sampleProperties = [
        {
          title: '2BHK Luxury, Andheri West',
          city: 'Mumbai',
          area: 'Andheri',
          purpose: 'RENT',
          type: 'RESIDENTIAL',
          priceDisplay: '₹ 45,000/mo',
          price: 45000,
          size: 780,
          beds: '2',
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1400&auto=format&fit=crop',
          tag: 'Ready to Move',
          description: 'Beautiful 2BHK apartment in prime location.',
          userId: user.id,
          isActive: true,
        },
        {
          title: 'Grade-A Office, Andheri East',
          city: 'Mumbai',
          area: 'Andheri',
          purpose: 'COMMERCIAL',
          type: 'COMMERCIAL',
          priceDisplay: '₹ 1.80 L/mo',
          price: 180000,
          size: 2400,
          beds: '-',
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1507209696998-3c532be9b2b1?q=80&w=1400&auto=format&fit=crop',
          tag: 'Furnished',
          description: 'Premium office space with modern infrastructure.',
          userId: user.id,
          isActive: true,
        }
      ];

      for (const property of sampleProperties) {
        await prisma.property.create({
          data: property,
        });
      }

      console.log('✅ Added sample properties');
    } else {
      // Show existing properties
      const properties = await prisma.property.findMany({
        select: {
          id: true,
          title: true,
          city: true,
          area: true,
          purpose: true,
          type: true,
          priceDisplay: true,
          isActive: true,
        },
        orderBy: { createdAt: 'desc' }
      });

      console.log('📋 Existing properties:');
      properties.forEach((prop, index) => {
        console.log(`${index + 1}. ${prop.title} (${prop.city}, ${prop.area}) - ${prop.priceDisplay} - ${prop.isActive ? 'Active' : 'Inactive'}`);
      });
    }

    console.log('\n🌐 Frontend should now show properties at: http://localhost:3000');

  } catch (error) {
    console.error('❌ Error checking properties:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure .env.local file exists');
    console.log('2. Check DATABASE_URL in .env.local');
    console.log('3. Make sure MySQL is running');
    console.log('4. Run: npm run db:push (to create tables)');
  } finally {
    await prisma.$disconnect();
  }
}

checkProperties();