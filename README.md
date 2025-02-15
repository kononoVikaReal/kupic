# Kupic - Online Marketplace Application

A modern web application for buying and selling items, built with Next.js 15 and TypeScript.

## Technologies Used

- **Next.js 15** - Chosen for its powerful features including:

  - Server-side rendering for better SEO
  - App Router for simplified routing
  - Built-in API routes
  - Optimized performance with automatic code splitting
  - Enhanced developer experience

- **TypeScript** - Provides:

  - Type safety during development
  - Better code maintainability
  - Enhanced IDE support
  - Reduced runtime errors

- **Tailwind CSS** - Selected for:
  - Rapid UI development
  - Built-in responsive design
  - Zero runtime CSS
  - Easy customization
  - Small bundle size

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v16.8 or higher)
- npm (v7 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/kononoVikaReal/kupic
cd kupic


Install dependencies:

npm install

bash
Set up environment variables:

Create .env file:

NEXT_PUBLIC_API_URL=http://localhost:3001/items

#Running the Application
##Development Mode
Start the development server:

npm run dev

bash
Open http://localhost:3000 in your browser

##Production Mode
Build the application:

npm run build

bash
Start the production server:

npm start

bash
#Project Structure
kupic/
├── src/
│   ├── app/              # App router pages
│   ├── components/       # Reusable components
│   ├── api/             # API routes
│   └── styles/          # Global styles
├── public/              # Static assets
└── types/              # TypeScript type definitions

text
#API Routes
The application uses RESTful API endpoints:

GET /api/items - Retrieve all items

GET /api/items/:id - Retrieve specific item

POST /api/items - Create new item

PUT /api/items/:id - Update existing item

DELETE /api/items/:id - Delete item

#Development Decisions
##App Router (Next.js 15)
Provides more intuitive routing structure

Better performance with React Server Components

Simplified API route handling

##Server Components
Reduced client-side JavaScript

Better initial page load performance

Improved SEO capabilities

##Environment Configuration
Separate development and production environments

Secure handling of sensitive data

Easy deployment configuration

##Contributing
Create a feature branch

Commit your changes

Push to the branch

Create a Pull Request

##Scripts
npm run dev - Start development server

npm run build - Build production application

npm start - Start production server

npm run lint - Run ESLint

##Notes
Ensure all environment variables are properly set before running the application

The API (backend) server must be running on port 3001 for local API calls

#License
License MIT
```
