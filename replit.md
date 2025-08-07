# Boss Meme Coin Creator

## Overview

This is a full-stack Farcaster Mini App for creating and deploying Boss-branded meme coins. Built with React frontend and Express backend, it allows users to upload images, configure token parameters, and simulate ERC-20 token deployment on Base mainnet. The application features a dark-themed UI with @debabhi branding, custom cat mascot logo, and handles the complete token deployment workflow from wallet connection to Farcaster sharing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **UI Framework**: Shadcn/ui components with Radix UI primitives for consistent, accessible interface
- **Styling**: Tailwind CSS with custom dark theme and CSS variables for theming
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Express.js**: RESTful API server with TypeScript support
- **File Upload**: Multer middleware for handling multipart/form-data image uploads
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL storage via connect-pg-simple
- **Development**: Hot module replacement and runtime error overlay for development experience

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM for schema management and migrations
- **Schema Design**: 
  - Users table with authentication credentials
  - Meme coins table tracking deployment details, contract addresses, and metadata
- **File Storage**: Currently simulated file storage (designed for IPFS integration)
- **In-Memory Storage**: Development fallback using Map-based storage implementation

### Authentication & Authorization
- **Session-based Authentication**: Express sessions stored in PostgreSQL
- **Password Security**: Basic password storage (production would use bcrypt hashing)
- **User Management**: User registration and login with username/password
- **Route Protection**: Middleware for protecting authenticated endpoints

### External Dependencies
- **Database**: Neon serverless PostgreSQL for cloud database hosting
- **Blockchain Integration**: Prepared for Ethereum/Base network contract deployment
- **File Storage**: Designed for IPFS integration for decentralized image storage
- **Social Integration**: Placeholder for Farcaster social media posting
- **UI Components**: Extensive Radix UI component library for accessible interface elements
- **Development Tools**: Replit integration with cartographer and runtime error modal plugins