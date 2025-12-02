#!/bin/bash

# Railway Database Deployment Script
# Run this script to deploy your database on Railway

echo "🚀 Starting Railway Database Deployment..."

# Step 1: Install Railway CLI (if not installed)
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm i -g @railway/cli
fi

# Step 2: Login to Railway
echo "🔐 Logging in to Railway..."
railway login

# Step 3: Link project
echo "🔗 Linking project..."
railway link

# Step 4: Generate Prisma Client
echo "⚙️  Generating Prisma Client..."
npx prisma generate

# Step 5: Deploy migrations
echo "📊 Deploying database migrations..."
npx prisma migrate deploy

echo "✅ Database deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Set DATABASE_URL in Railway dashboard (Variables tab)"
echo "2. Set other environment variables (NEXTAUTH_SECRET, NEXTAUTH_URL, etc.)"
echo "3. Deploy your Next.js application"

