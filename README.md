# Devotional API

Simple REST API for storing and serving devotional entries with PostgreSQL.

**Features**

- List all devotions
- Fetch a devotion by id
- Create a devotion
- Delete a devotion
- Daily devotion (deterministic by day of year)
- Random devotion

**Tech Stack**

- Node.js, Express
- PostgreSQL (`pg`)
- `dotenv` for config

**Project Structure**

- `main.js` Express app entry
- `routes/devotions.js` Route definitions
- `controllers/devotions.js` Request handlers
- `models/devotions.js` Database queries
- `config/databasepg.js` Postgres pool config
- `seed/data.js` Seed data placeholder (currently empty)

**Setup**

1. Install dependencies:

```bash
npm install
```

1. Create a `.env` file:

```bash
PG_HOST=localhost
PG_USER=your_user
PG_PASSWORD=your_password
PG_DATABASE=your_db
PG_PORT=5432
PORT=5000
```

1. Ensure PostgreSQL is running and a database named `devotionalapi` exists.
1. Start the API:

```bash
npm run dev
```

The server logs: `Server running on http://localhost:<PORT>`.

**Endpoints**

- `GET /` Health check
- `GET /api/devotions` List all devotions
- `POST /api/devotions` Create a devotion
- `GET /api/devotions/today` Get today's devotion
- `GET /api/devotions/random` Get a random devotion
- `GET /api/devotions/:id` Get a devotion by id
- `DELETE /api/devotions/:id` Delete a devotion by id

**Request Body for Create**

```json
{
  "title": "string",
  "focus": "string",
  "verse": "string",
  "insight": "string",
  "realLifeReflection": "string",
  "prayer": "string",
  "action": "string",
  "author": "string"
}
```

**Notes**

- `GET /api/devotions/today` uses the day-of-year index, cycling through rows ordered by `id`.
- `POST /api/devotions` returns the newly created row.
