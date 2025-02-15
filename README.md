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

- Docker

## Installation

### Clone the repository:

```bash
git clone https://github.com/kononoVikaReal/kupic
cd kupic
```

### Set up environment variables:

Create a `.env` file in `/frontend/.env` and add the following:

```ini
NEXT_PUBLIC_API_URL=http://localhost:3001/items
SESSION_SECRET=ANY_SECRET_KEY
```

## Running the Application with Docker

### Build and start the project with Docker:

Use docker-compose to build and start the containers.
Note:
The frontend container is named frontend (important for the setup).
The backend container is named backend (important for the setup).

```bash
docker-compose up --build
```

### Access the Application:

The frontend should be available at http://localhost:3000 and the backend API at http://localhost:3001.

## Stopping the Application

To stop the Docker containers, run:

```bash
docker-compose down
```

Or write:

```bash
docker ps
```

And then manually stop frontend and backend containers:

```bash
docker stop <container_name>
```

## Frontend Project Structure

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

## Frontend API Routes

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

## Notes

- Ensure all environment variables are properly set before running the application.
- The API (backend) server must be running on port `3001` for local API calls.

## Template Data

- In the file `templateData.txt` In folder `/frontend/public`, you will find objects that you can POST to [/api/items](http://localhost:3001/items) to have something to work with.

## License

MIT
