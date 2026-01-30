# GENZLA - Luxury Custom Clothing Brand Website

A full-stack luxury clothing brand website with customization ordering, admin panel, and authentication system.

## Tech Stack

### Frontend
- **Next.js 14** (React)
- **SCSS Modules** (No Tailwind CSS)
- **Framer Motion** - Page transitions
- **GSAP** - Sliders, scroll animations, luxury interactions

### Backend
- **Node.js + Express**
- **MongoDB Atlas**
- **Cloudinary** - Image uploads
- **Nodemailer** - Email & OTP system
- **bcryptjs** - Password hashing
- **JWT** - Authentication

## Features

### Customer Features
- OTP-based signup flow
- Email + Password login
- Submit customization requests
- Upload design images
- View order history
- Track order status
- Light/Dark mode toggle (saved in localStorage)

### Admin Features
- Admin dashboard
- View all users and orders
- Product management (CRUD)
- Order status management
- User details and order history

### Customization Types
- Hand Painted
- DTF
- DTG
- Puff Print
- Embroidery

### Product Categories
- Jacket
- T-shirt
- Shirt
- Jeans
- Baggy Pants
- Bags

## Project Structure

```
Genzla/
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   ├── styles/       # Global styles
│   │   └── lib/          # Utilities
│   └── public/           # Static assets
└── backend/
    └── src/
        ├── models/       # MongoDB models
        ├── routes/       # API routes
        ├── middleware/   # Auth middleware
        └── utils/        # Email, Cloudinary utils
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure environment variables:
- MongoDB Atlas connection string
- JWT secret
- Cloudinary credentials
- SMTP credentials for email

5. Start development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start development server:
```bash
npm run dev
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `SMTP_FROM` - Email sender address
- `ADMIN_EMAIL` - Admin email for contact form

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Authentication Flow

### Customer Signup
1. User enters email
2. OTP sent to email
3. User verifies OTP
4. User sets password and name
5. Account created

### Customer Login
- Email + Password authentication
- JWT token stored in localStorage

### Admin Login
- Same login endpoint
- Role-based access control

## API Endpoints

### Auth
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders/customization` - Submit customization request
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders` - Get all orders (Admin)
- `PATCH /api/orders/:id/status` - Update order status (Admin)

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details

### Contact
- `POST /api/contact` - Submit contact form

## Design System

### Colors
- **Light Mode**: Off-white (#f5f4f0), Grey, Black accents
- **Dark Mode**: Black (#050509), Charcoal, Gold accents (#b89b5e)
- **No gradients** - Solid colors only

### Typography
- Clean, minimalistic typography
- High spacing
- Uppercase labels with letter-spacing

### Animations
- Smooth, slow animations
- GSAP for scroll animations
- Framer Motion for page transitions

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Backend (Render/Railway)
1. Push code to GitHub
2. Create new service
3. Set environment variables
4. Deploy

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- OTP expiration (10 minutes)
- Rate limiting on OTP requests
- Email validation
- Admin role-based access control

## Notes

- Placeholder images should be added to `frontend/public/images/`
- Admin user must be created manually in database (role: "admin")
- OTP emails require SMTP configuration
- Image uploads require Cloudinary setup
