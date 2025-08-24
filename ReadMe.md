# Overview

This is a modern full-stack portfolio website built for Atul Devichand Mahankal, a passionate fullstack developer from India. The application showcases personal information, skills, GitHub statistics, and social links through a sleek, responsive interface. It features a React-based frontend with TypeScript support, Express.js backend, and PostgreSQL database integration using Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application uses React 18 with TypeScript, built with Vite for optimal development experience and fast builds. The UI framework is based on shadcn/ui components built on top of Radix UI primitives, providing accessible and customizable components. Styling is handled through Tailwind CSS with a custom dark theme optimized for portfolio presentation.

Key frontend decisions:
- **React with TypeScript**: Chosen for type safety and modern development patterns
- **Vite**: Selected for fast development server and optimized builds over Create React App
- **shadcn/ui + Radix UI**: Provides accessible, customizable components with consistent design
- **Tailwind CSS**: Enables rapid styling with utility-first approach and easy theme customization
- **TanStack Query**: Manages server state and API interactions with built-in caching
- **Wouter**: Lightweight routing solution instead of React Router for simplicity

## Backend Architecture
The server runs on Express.js with TypeScript, following RESTful API patterns. It implements a storage abstraction layer that supports both in-memory storage (for development) and database persistence. The API handles portfolio data retrieval, profile view tracking, and serves as a proxy for GitHub API calls to avoid CORS issues.

Key backend decisions:
- **Express.js**: Provides robust HTTP server capabilities with middleware support
- **Storage Abstraction**: Allows switching between in-memory and database storage
- **API Proxy Pattern**: GitHub API proxy prevents CORS issues in the frontend
- **Middleware Logging**: Custom request/response logging for API monitoring

## Data Storage
The application uses PostgreSQL with Drizzle ORM for type-safe database operations. The schema includes tables for users, portfolio information, social links, and skills. Drizzle was chosen over Prisma for its lightweight nature and direct SQL generation.

Database schema design:
- **portfolio**: Core user information and profile view tracking
- **social_links**: External platform links with icons and metadata
- **skills**: Technical skills categorized by type (Frontend, Backend, Tools, etc.)
- **users**: Authentication support (planned for future expansion)

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting via @neondatabase/serverless
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL operations
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI and Styling
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Icon library providing consistent iconography

### State Management and Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with validation support
- **Zod**: Schema validation for API requests and responses

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking across the entire codebase
- **ESBuild**: Fast JavaScript bundler for production builds

### External APIs
- **GitHub API**: Fetched via server proxy to display repository statistics and user information
- **Google Fonts**: Custom font loading for enhanced typography