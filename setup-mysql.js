const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupMySQL() {
  console.log('🔧 Setting up MySQL for Beyond Estates...\n');

  // Database configuration
  const config = {
    host: 'localhost',
    user: 'root',
    password: 'rootpassword', // Change this to your MySQL root password
    port: 3306
  };

  try {
    // Connect to MySQL
    console.log('📡 Connecting to MySQL...');
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL successfully!\n');

    // Create database
    console.log('🗄️ Creating database...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS beyond_estates');
    console.log('✅ Database "beyond_estates" created!\n');

    // Create user (optional - you can use root user)
    console.log('👤 Creating database user...');
    try {
      await connection.execute(`CREATE USER IF NOT EXISTS 'beyond_user'@'localhost' IDENTIFIED BY 'beyond_password'`);
      await connection.execute(`GRANT ALL PRIVILEGES ON beyond_estates.* TO 'beyond_user'@'localhost'`);
      await connection.execute(`FLUSH PRIVILEGES`);
      console.log('✅ User "beyond_user" created with full privileges!\n');
    } catch (error) {
      console.log('⚠️ User creation failed (you can use root user instead)\n');
    }

    // Close connection
    await connection.end();

    // Create .env.local file
    console.log('📝 Creating .env.local file...');
    const envContent = `# Database - MySQL
DATABASE_URL="mysql://beyond_user:beyond_password@localhost:3306/beyond_estates"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# JWT
JWT_SECRET="your-jwt-secret-key-here-change-in-production"
`;

    const envPath = path.join(__dirname, '.env.local');
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local file created!\n');

    console.log('🎉 MySQL setup completed successfully!\n');
    console.log('📋 Next steps:');
    console.log('1. npm install');
    console.log('2. npm run db:generate');
    console.log('3. npm run db:push');
    console.log('4. npm run db:seed');
    console.log('5. npm run dev\n');

    console.log('🔑 Database credentials:');
    console.log('   Database: beyond_estates');
    console.log('   User: beyond_user');
    console.log('   Password: beyond_password');
    console.log('   Host: localhost:3306\n');

  } catch (error) {
    console.error('❌ Error setting up MySQL:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check if port 3306 is available');
    console.log('3. Verify your MySQL root password');
    console.log('4. Try: mysql -u root -p (to test connection)');
  }
}

// Check if mysql2 is installed
try {
  require('mysql2');
  setupMySQL();
} catch (error) {
  console.log('📦 Installing mysql2 package...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install mysql2', { stdio: 'inherit' });
    console.log('✅ mysql2 installed! Running setup...\n');
    setupMySQL();
  } catch (installError) {
    console.error('❌ Failed to install mysql2. Please run: npm install mysql2');
  }
}




