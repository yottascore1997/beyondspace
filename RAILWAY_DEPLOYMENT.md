# Railway Database Deployment Guide

## Step 1: Create Railway Account & Project

1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Create a new project

## Step 2: Add MySQL Database Service

1. Click **"+ New"** button
2. Select **"Database"** → **"Add MySQL"**
3. Railway will automatically create a MySQL database instance

## Step 3: Get Database Connection String

1. Click on the MySQL service you just created
2. Go to **"Variables"** tab
3. Copy the `DATABASE_URL` - it will look like:
   ```
   mysql://root:password@containers-us-west-xxx.railway.app:3306/railway
   ```

## Step 4: Set Environment Variables

### Option A: In Railway Dashboard
1. Go to your **Next.js service** (or create one)
2. Go to **"Variables"** tab
3. Add: `DATABASE_URL` = (the connection string from MySQL service)

### Option B: Using Railway CLI
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link your project
railway link

# Set DATABASE_URL
railway variables set DATABASE_URL="mysql://root:password@containers-us-west-xxx.railway.app:3306/railway"
```

## Step 5: Deploy Database Schema

### Method 1: Using Prisma Migrate (Recommended)
```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate deploy

# Or push schema directly (for development)
npx prisma db push
```

### Method 2: Using Railway Build Command
Add to your `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "db:deploy": "prisma migrate deploy"
  }
}
```

Then in Railway, set build command:
```bash
npm run build && npm run db:deploy
```

## Step 6: Run Migrations on Railway

### Option A: Using Railway CLI
```bash
# Connect to Railway
railway run npx prisma migrate deploy
```

### Option B: Using Railway Dashboard
1. Go to your service
2. Open **"Deployments"** tab
3. Click **"Deploy"** with build command that includes migrations

### Option C: One-time Migration Script
Create a script in Railway:
```bash
railway run npx prisma migrate deploy
```

## Step 7: Verify Database Connection

```bash
# Check connection
railway run npx prisma db pull

# View database in Prisma Studio (optional)
railway run npx prisma studio
```

## Important Commands Summary

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login to Railway
railway login

# 3. Link your project
railway link

# 4. Set DATABASE_URL
railway variables set DATABASE_URL="your-connection-string"

# 5. Generate Prisma Client
npx prisma generate

# 6. Deploy migrations
npx prisma migrate deploy

# 7. Or push schema (development)
npx prisma db push
```

## Railway Configuration File (Optional)

Create `railway.json` in your project root:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build && npx prisma migrate deploy"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Environment Variables Needed

Make sure these are set in Railway:
- `DATABASE_URL` - MySQL connection string (auto-provided by Railway MySQL service)
- `NEXTAUTH_SECRET` - For NextAuth (generate with: `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your Railway app URL (e.g., `https://your-app.railway.app`)
- Any other environment variables your app needs

## Troubleshooting

### Connection Issues
- Make sure `DATABASE_URL` is correctly set
- Check if MySQL service is running
- Verify network connectivity

### Migration Issues
- Run `npx prisma generate` first
- Use `npx prisma migrate deploy` for production
- Use `npx prisma db push` for quick schema updates (development only)

### SSL Connection (if required)
Add `?sslmode=require` to your DATABASE_URL:
```
mysql://root:password@host:3306/db?sslmode=require
```

