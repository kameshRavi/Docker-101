# Docker-101

A containerized full-stack JavaScript application demonstrating Docker usage with a questionnaire system.

## Features

- User authentication (login/signup)
- Interactive questionnaire with JavaScript questions
- Real-time scoring
- Difficulty levels for questions (easy/medium/hard)
- Persistent data storage using JSON files
- Docker containerization for both frontend and backend

## Tech Stack

- Frontend:
  - React.js
  - React Router
  - Tailwind CSS
  - Vite

- Backend:
  - Node.js
  - Express.js
  - JSON file storage

- DevOps:
  - Docker
  - Docker Compose

## Prerequisites

- Docker and Docker Compose installed on your machine

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd Docker-101
```

2. Start the application using Docker Compose:
```bash
docker compose up
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## Project Structure

```
.
├── backend/
│   ├── data/               # JSON storage
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── index.html
│   └── package.json
└── docker-compose.yml
```

## API Endpoints

- `POST /api/signup`: Create a new user account
- `POST /api/login`: Authenticate user
- `GET /api/questions`: Fetch questionnaire (requires authentication)
- `POST /api/submit`: Submit answers and get score (requires authentication)

## Development

To run the application in development mode:

1. Start the backend:
```bash
cd backend
pnpm install
pnpm start
```

2. Start the frontend:
```bash
cd frontend
pnpm install
pnpm dev
```

## Docker Configuration

- Frontend container:
  - Multi-stage build
  - Built with Node.js and served with `serve`
  - Exposed on port 3000

- Backend container:
  - Multi-stage build
  - Node.js runtime
  - Exposed on port 8080
  - Persistent volume for data storage
