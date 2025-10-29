# MySQL Connection Guide - Step by Step

## 🚀 **Quick Setup (Choose One Method)**

### **Method 1: XAMPP (Easiest for Windows)**

1. **Download XAMPP**
   - Go to https://www.apachefriends.org/
   - Download XAMPP for Windows
   - Install and start XAMPP

2. **Start MySQL**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - MySQL will run on port 3306

3. **Create Database**
   - Open http://localhost/phpmyadmin in browser
   - Click "New" to create database
   - Name: `beyond_estates`
   - Click "Create"

4. **Update .env.local**
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/beyond_estates"
   ```

### **Method 2: Docker (Recommended)**

1. **Install Docker Desktop**
   - Download from https://www.docker.com/products/docker-desktop
   - Install and start Docker

2. **Run MySQL Container**
   ```bash
   docker run --name mysql-beyond-estates -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=beyond_estates -p 3306:3306 -d mysql:8.0
   ```

3. **Update .env.local**
   ```env
   DATABASE_URL="mysql://root:rootpassword@localhost:3306/beyond_estates"
   ```

### **Method 3: Manual MySQL Installation**

1. **Install MySQL**
   - Download from https://dev.mysql.com/downloads/mysql/
   - Install with default settings
   - Remember the root password

2. **Create Database**
   ```bash
   mysql -u root -p
   CREATE DATABASE beyond_estates;
   exit
   ```

3. **Update .env.local**
   ```env
   DATABASE_URL="mysql://root:YOUR_ROOT_PASSWORD@localhost:3306/beyond_estates"
   ```

## 🔧 **After MySQL Setup**

1. **Navigate to project**
   ```bash
   cd beyond-estates
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

## 🐛 **Troubleshooting**

### **Connection Refused Error**
- Check if MySQL is running
- Verify port 3306 is not blocked
- Check firewall settings

### **Access Denied Error**
- Verify username and password
- Check if user has proper privileges
- Try using root user

### **Database Not Found Error**
- Make sure database exists
- Check database name spelling
- Verify connection string format

## 📝 **Connection String Format**

```
mysql://username:password@host:port/database_name
```

**Examples:**
- Local with root: `mysql://root:password@localhost:3306/beyond_estates`
- Local without password: `mysql://root:@localhost:3306/beyond_estates`
- Docker: `mysql://root:rootpassword@localhost:3306/beyond_estates`

## ✅ **Test Connection**

To test if MySQL is working:

```bash
# Test MySQL connection
mysql -u root -p

# Or test with your credentials
mysql -u beyond_user -p beyond_estates
```

## 🎯 **Quick Commands**

```bash
# Start XAMPP MySQL
# (Use XAMPP Control Panel)

# Start Docker MySQL
docker start mysql-beyond-estates

# Check if MySQL is running
netstat -an | findstr 3306

# Connect to MySQL
mysql -u root -p
```

Choose the method that works best for you and follow the steps!




