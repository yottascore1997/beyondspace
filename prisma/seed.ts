import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@beyondestates.com' },
    update: {},
    create: {
      email: 'admin@beyondestates.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin);

  // Create sample properties
  const properties = [
    {
      title: '2BHK Luxury, Andheri West',
      city: 'Mumbai',
      area: 'Andheri',
      purpose: 'buy',
      type: 'RESIDENTIAL',
      priceDisplay: '₹ 1.85 Cr',
      price: 18500000,
      size: 780,
      beds: '2',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1400&auto=format&fit=crop',
      tag: 'Ready to Move',
      description: 'Beautiful 2BHK apartment in prime location with modern amenities.',
      userId: admin.id,
    },
    {
      title: 'Grade‑A Office, Andheri East',
      city: 'Mumbai',
      area: 'Andheri',
      purpose: 'commercial',
      type: 'COMMERCIAL',
      priceDisplay: '₹ 1.80 L/mo',
      price: 180000,
      size: 2400,
      beds: '-',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1507209696998-3c532be9b2b1?q=80&w=1400&auto=format&fit=crop',
      tag: 'Furnished',
      description: 'Premium office space with modern infrastructure and excellent connectivity.',
      userId: admin.id,
    },
    {
      title: 'Spacious 3BHK, Thane West',
      city: 'Mumbai',
      area: 'Thane',
      purpose: 'rent',
      type: 'RESIDENTIAL',
      priceDisplay: '₹ 42,000/mo',
      price: 42000,
      size: 1050,
      beds: '3',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=80&w=1400&auto=format&fit=crop',
      tag: 'Near Metro',
      description: 'Comfortable 3BHK with excellent metro connectivity and modern amenities.',
      userId: admin.id,
    },
    {
      title: 'Modern 2BHK, Andheri (Pune)',
      city: 'Pune',
      area: 'Andheri',
      purpose: 'buy',
      type: 'RESIDENTIAL',
      priceDisplay: '₹ 78 L',
      price: 7800000,
      size: 900,
      beds: '2',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1400&auto=format&fit=crop',
      tag: 'New Launch',
      description: 'Brand new 2BHK apartment in developing area with great potential.',
      userId: admin.id,
    },
    {
      title: 'Smart Office Floor, Thane (Pune)',
      city: 'Pune',
      area: 'Thane',
      purpose: 'commercial',
      type: 'COMMERCIAL',
      priceDisplay: '₹ 95,000/mo',
      price: 95000,
      size: 1800,
      beds: '-',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1400&auto=format&fit=crop',
      tag: 'Plug & Play',
      description: 'Fully furnished office space ready for immediate occupancy.',
      userId: admin.id,
    },
  ];

  for (const property of properties) {
    await prisma.property.create({
      data: property,
    });
  }

  console.log('Sample properties created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });




