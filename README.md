# Bartender MVC

A JavaScript MVC web application where patrons browse a cocktail menu and place orders, while bartenders manage the preparation queue.

## Requirements

- Node.js 22.5 or newer (uses Node's built-in SQLite database)
- npm

## Run locally

```bash
npm install
npm start
```

Open <http://localhost:3000>.

The SQLite database is created automatically at `data/bartender.db`, and the cocktail menu is seeded on the first run.

## MVC structure

- `models/` contains database access and business data operations.
- `views/` contains EJS pages for the homepage, menu, forms, and queue.
- `controllers/` validates HTTP input and coordinates models and views.
- `routes/` maps GET and POST requests to controllers.
- `config/database.js` initializes SQLite tables and seed data.

## Main routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/` | Application homepage |
| GET | `/menu` | Display menu and order form |
| POST | `/orders` | Create an order |
| GET | `/orders` | Display bartender queue |
| GET/POST | `/orders/:id/edit` | View or save order edits |
| POST | `/orders/:id/status` | Change preparation status |

Order statuses move from **queued** to **preparing** to **ready**. Ready orders remain visible for pickup by a server.
