# MySQL Setup Guide for Beyond Estates

## Quick Setup Options

### Option 1: Local MySQL Installation

1. **Install MySQL**
   - Download from [MySQL Official Website](https://dev.mysql.com/downloads/mysql/)
   - Or use package manager:
     ```bash
     # Windows (with Chocolatey)
     choco install mysql
     
     # macOS (with Homebrew)
     brew install mysql
     
     # Ubuntu/Debian
     sudo apt update
     sudo apt install mysql-server
     ```

2. **Start MySQL Service**
   ```bash
   # Windows
   net start mysql
   
   # macOS/Linux
   sudo systemctl start mysql
   # or
   brew services start mysql
   ```

3. **Create Database**
   ```bash
   mysql -u root -p
   CREATE DATABASE beyond_estates;
   CREATE USER 'beyond_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON beyond_estates.* TO 'beyond_user'@'localhost';
   FLUSH PRIVILEGES;
   exit
   ```

4. **Update .env.local**
   ```env
   DATABASE_URL="mysql://beyond_user:your_password@localhost:3306/beyond_estates"
   ```

### Option 2: Docker MySQL (Recommended for Development)

1. **Run MySQL Container**
   ```bash
   docker run --name mysql-beyond-estates \
     -e MYSQL_ROOT_PASSWORD=rootpassword \
     -e MYSQL_DATABASE=beyond_estates \
     -e MYSQL_USER=beyond_user \
     -e MYSQL_PASSWORD=your_password \
     -p 3306:3306 \
     -d mysql:8.0
   ```

2. **Update .env.local**
   ```env
   DATABASE_URL="mysql://beyond_user:your_password@localhost:3306/beyond_estates"
   ```

### Option 3: Cloud MySQL Services

#### PlanetScale (Serverless MySQL)
1. Sign up at [PlanetScale](https://planetscale.com)
2. Create a new database
3. Get connection string
4. Update .env.local:
   ```env
   DATABASE_URL="mysql://username:password@your-planetscale-url/beyond_estates"
   ```

#### Railway
1. Sign up at [Railway](https://railway.app)
2. Add MySQL service
3. Get connection string
4. Update .env.local

#### AWS RDS
1. Create RDS MySQL instance
2. Get endpoint and credentials
3. Update .env.local:
   ```env
   DATABASE_URL="mysql://username:password@your-rds-endpoint:3306/beyond_estates"
   ```

## Database Setup Commands

After setting up MySQL, run these commands:

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push database schema to MySQL
npm run db:push

# Seed with sample data
npm run db:seed

# Start development server
npm run dev
```

## Troubleshooting

### Connection Issues
- Check if MySQL is running: `mysql -u root -p`
- Verify port 3306 is open
- Check firewall settings

### Permission Issues
- Ensure user has proper privileges
- Try: `GRANT ALL PRIVILEGES ON beyond_estates.* TO 'your_user'@'localhost';`

### Docker Issues
- Check container status: `docker ps`
- View logs: `docker logs mysql-beyond-estates`
- Restart container: `docker restart mysql-beyond-estates`

## Production Considerations

1. **Use Connection Pooling**
   ```env
   DATABASE_URL="mysql://user:pass@host:3306/db?connection_limit=5&pool_timeout=20"
   ```

2. **Enable SSL in Production**
   ```env
   DATABASE_URL="mysql://user:pass@host:3306/db?sslmode=require"
   ```

3. **Use Environment-Specific URLs**
   - Development: Local MySQL
   - Staging: Cloud MySQL (smaller instance)
   - Production: Managed MySQL service

## Security Best Practices

1. **Use Strong Passwords**
2. **Limit Database User Permissions**
3. **Enable SSL/TLS**
4. **Regular Backups**
5. **Monitor Connection Limits**

## Performance Tips

1. **Add Database Indexes** (if needed)
2. **Use Connection Pooling**
3. **Monitor Query Performance**
4. **Regular Database Maintenance**

For any issues, check the Prisma documentation or MySQL logs.




