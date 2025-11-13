# Beyond Estates - Next.js Real Estate Platform

A modern real estate platform built with Next.js, TypeScript, and Tailwind CSS. Features property listings for Mumbai and Pune with a comprehensive admin panel for property management.

## Features

### Public Features
- 🏠 Property listings with filtering and search
- 🎨 Modern, responsive design with Tailwind CSS
- 🔍 Advanced filtering by city, area, purpose, and type
- 📱 Mobile-first responsive design
- ⚡ Fast loading with Next.js optimization

### Admin Features
- 🔐 JWT-based authentication
- 📊 Property management (CRUD operations)
- 👥 User management
- 📈 Dashboard with property statistics
- 🎛️ Real-time property status management

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MySQL 8.0+ (or MariaDB 10.3+)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beyond-estates
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database - MySQL
   DATABASE_URL="mysql://username:password@localhost:3306/beyond_estates"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

   # JWT
   JWT_SECRET="your-jwt-secret-key-here-change-in-production"
   ```

4. **Set up MySQL database**
   
   **Option A: Local MySQL**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE beyond_estates;
   exit
   ```
   
   **Option B: Using Docker**
   ```bash
   docker run --name mysql-beyond-estates -e MYSQL_ROOT_PASSWORD=yourpassword -e MYSQL_DATABASE=beyond_estates -p 3306:3306 -d mysql:8.0
   ```

5. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push database schema
   npm run db:push

   # Seed with sample data
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Admin Access

### Default Admin Credentials
- **Email**: beyondspace@gmail.com
- **Password**: admin1234

### Admin Panel Features
- Access at `/admin`
- Add, edit, and delete properties
- Toggle property active/inactive status
- View property statistics
- Manage property details

## Project Structure

```
beyond-estates/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   └── properties/     # Property management
│   │   ├── admin/              # Admin panel pages
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── admin/              # Admin components
│   │   ├── Header.tsx          # Site header
│   │   ├── Hero.tsx            # Hero section
│   │   ├── PropertyCard.tsx    # Property card component
│   │   ├── WhyUs.tsx           # Features section
│   │   └── Footer.tsx          # Site footer
│   └── lib/
│       ├── auth.ts             # Authentication utilities
│       ├── jwt.ts              # JWT utilities
│       └── prisma.ts           # Database client
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeding
└── public/                     # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `POST /api/properties` - Create new property (Admin only)
- `GET /api/properties/[id]` - Get single property
- `PUT /api/properties/[id]` - Update property (Admin only)
- `DELETE /api/properties/[id]` - Delete property (Admin only)

## Database Schema

### Models
- **User**: Admin and regular users
- **Property**: Property listings
- **City**: Available cities
- **Area**: Areas within cities

### Key Features
- JWT-based authentication
- Role-based access control
- Property status management
- Search and filtering capabilities

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
```env
# MySQL Database (use your production MySQL URL)
DATABASE_URL="mysql://username:password@your-mysql-host:3306/beyond_estates"

# Or use a managed database service like PlanetScale, AWS RDS, etc.
# DATABASE_URL="mysql://username:password@your-planetscale-url/beyond_estates"

NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
JWT_SECRET="your-production-jwt-secret"
```

### Recommended MySQL Hosting Services
- **PlanetScale** (Serverless MySQL)
- **AWS RDS** (Amazon Relational Database Service)
- **Google Cloud SQL**
- **DigitalOcean Managed Databases**
- **Railway** (with MySQL addon)

## Customization

### Adding New Cities/Areas
1. Update the Prisma schema
2. Run `npm run db:push`
3. Update the frontend components

### Styling
- All styles use Tailwind CSS
- Primary color: `#a08efe` (configurable in components)
- Responsive design with mobile-first approach

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email hello@beyondestates.com or create an issue in the repository.