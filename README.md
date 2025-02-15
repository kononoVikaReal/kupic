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

### Clone the repository:

```bash
git clone https://github.com/kononoVikaReal/kupic
cd kupic
```

### Install dependencies:

```bash
npm install
```

### Set up environment variables:

Create a `.env` file and add the following:

```ini
NEXT_PUBLIC_API_URL=http://localhost:3001/items
SESSION_SECRET=ANY_SECRET_KEY
```

## Running the Application

### Development Mode:

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Mode:

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
kupic/
├── src/
│   ├── app/              # App router pages
│   │   └── api/          # API routes
│   ├── components/       # Reusable components
│   ├── lib/              # Utility functions and shared logic
│   │
│   └── db/               # Database simulation
└── public/               # Static public assets
```

## API Routes

The application uses RESTful API endpoints:

```http
GET    /api/items         # Retrieve all items
GET    /api/items/:id     # Retrieve specific item
POST   /api/items         # Create a new item (The IDs of the created ads will be saved in the 'items' key in localStorage)
PUT    /api/items/:id     # Update an existing item
DELETE /api/items/:id     # Delete an item
GET    /api/verifySession # Verifying the presence and authenticity of the user's session
POST    /api/login        # User authorization and session saving in cookies
```

## Development Decisions

### App Router (Next.js 15)

- Provides a more intuitive routing structure
- Enhances performance with React Server Components
- Simplifies API route handling

### Server Components

- Reduces client-side JavaScript load
- Improves initial page load performance
- Enhances SEO capabilities

### Environment Configuration

- Separate development and production environments
- Secure handling of sensitive data
- Easy deployment configuration

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## Scripts

```bash
npm run dev     # Start development server
npm run build   # Build production application
npm start      # Start production server
npm run lint    # Run ESLint
```

## Notes

- Ensure all environment variables are properly set before running the application.
- The API (backend) server must be running on port `3001` for local API calls.

## Template Data

- In the file templateData.txt In folder public, you will find objects that you can POST to [/api/items](http://localhost:3001/items) to have something to work with.

## License

MIT
