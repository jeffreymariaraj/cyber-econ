# System Architecture

## Directory Structure

We will follow a modular directory structure to ensure separation of concerns and scalability.

```
cyber_econ/
├── specs/                  # Design specifications and documentation
│   ├── system_architecture.md
│   ├── risk_logic.md
│   └── api_contract.md
├── backend/                # FastAPI backend
│   ├── pyproject.toml      # Dependency management
│   ├── Dockerfile
│   └── app/
│       ├── main.py         # Entry point
│       ├── core/           # Configuration and core settings
│       ├── models/         # Pydantic models (Data validation)
│       ├── services/       # Business logic (Scanner, Risk Engine)
│       └── routers/        # API endpoints
├── frontend/               # React + Vite frontend
│   ├── package.json
│   ├── Dockerfile
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page views (Dashboard, etc.)
│       └── services/       # API integration
└── docker-compose.yml      # Orchestration
```

## Docker Compose Setup

The `docker-compose.yml` will orchestrate the following services:
1.  **Backend**: FastAPI service running on port 8000.
2.  **Frontend**: React development server (or Nginx build) running on port 3000 (or 80).
3.  **Database**: MongoDB service.

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - MONGODB_URL=mongodb://mongo:27017/cyberecon
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```
