# SmartChef AI

SmartChef AI is a production-style final-year Computer Science project: an intelligent recipe generator, pantry tracker, and personalized meal planner built with React, TypeScript, FastAPI, SQLAlchemy, JWT authentication, TF-IDF recommendations, and Docker.

## Features

- Premium responsive UI with dark mode, animations, glassmorphism, loading states, empty states, and accessible controls.
- JWT authentication with role-based admin support.
- Ingredient, cuisine, diet, calorie, time, and difficulty based recipe search.
- TF-IDF and cosine similarity recipe recommendation engine.
- AI-style recipe generation, nutrition estimation, substitutions, confidence scores, and cooking time estimates.
- Pantry management with expiry and low-stock alerts.
- Weekly meal planner, shopping list generation, export/print-friendly views.
- Admin analytics with Chart.js visualizations.
- REST API docs, seed dataset, SQL schema, tests, Docker, and environment templates.

## Project Structure

```text
Smart Recipe Generator/
  backend/              FastAPI API, database models, AI services, tests
  frontend/             React + TypeScript + Tailwind app
  database/             PostgreSQL schema and seed SQL
  docs/                 API documentation and deployment guide
  docker-compose.yml    PostgreSQL, Redis, backend, frontend
```

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python scripts/seed.py
uvicorn app.main:app --reload
```

API documentation will be available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:5173`.

### Docker

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:8000`

## Demo Login

After seeding:

- User: `student@smartchef.ai` / `password123`
- Admin: `admin@smartchef.ai` / `admin123`

## Core Algorithms

The recommendation engine combines:

- TF-IDF over recipe title, cuisine, diet tags, ingredients, and instructions.
- Cosine similarity for content-based recipe matching.
- User preference boosts from saved recipes, pantry overlap, and cooking history.
- Trending score from views, ratings, saves, and recency.

Each recommendation includes a confidence percentage so the UI can explain why a recipe was suggested.

## Quality Targets

- Mobile-first responsive layout.
- Lazy-loaded routes and optimized image usage.
- Redis-ready cache layer.
- Pagination/infinite-scroll friendly APIs.
- Testable service layer.
- Dockerized deployment path.

