const fs = require('fs');
const path = require('path');

// Create .env.local file
const envContent = `# Database - MySQL
DATABASE_URL="mysql://root:@localhost:3306/beyond"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# JWT
JWT_SECRET="your-jwt-secret-key-here-change-in-production"
`;

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
} else {
  console.log('⚠️  .env.local already exists');
}

console.log(`
🚀 Beyond Estates Setup Complete!

Next steps:
1. Run: npm install
2. Run: npm run db:generate
3. Run: npm run db:push
4. Run: npm run db:seed
5. Run: npm run dev

Admin credentials:
- Email: beyondspace@gmail.com
- Password: admin1234

Visit: http://localhost:3000
Admin Panel: http://localhost:3000/admin
`);
