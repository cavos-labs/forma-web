# Forma - Web Application & API

This repository contains the Forma web application, which serves as both the **landing page** and **API backend** for the Forma project. Built with [Next.js](https://nextjs.org) and TypeScript, it provides a full-stack solution with authentication, payment processing, and core application functionality.

## Features

- **Landing Page**: Public-facing website with pricing and product information
- **API Backend**: RESTful API endpoints for authentication, payments, and core functionality
- **Authentication**: User signup, signin, and session management
- **Dashboard**: Protected user dashboard interface
- **Database Integration**: Supabase integration for data persistence

## Project Structure

```
app/
├── api/                 # API routes
│   ├── auth/           # Authentication endpoints
│   └── currency/       # Currency-related endpoints
├── components/         # Reusable React components
├── dashboard/          # Dashboard pages
├── pricing/           # Pricing page
└── page.tsx           # Landing page
lib/                   # Utility libraries
├── auth.ts            # Authentication helpers
└── supabase.ts        # Database client
sql/                   # Database initialization scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (create `.env.local`):

```bash
# Add your Supabase credentials and other environment variables
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## API Endpoints

The application provides several API endpoints:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User authentication  
- `POST /api/auth/signout` - User logout
- `GET /api/currency` - Currency-related data

## Development

- **Frontend**: React components in `app/components/`
- **Pages**: Next.js App Router pages in `app/`
- **API**: Server-side API routes in `app/api/`
- **Styling**: Tailwind CSS
- **Database**: Supabase integration

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

This application can be deployed on platforms that support Next.js, such as Vercel, Netlify, or any Node.js hosting service.
