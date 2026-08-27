const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dataDirectory = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDirectory, { recursive: true });

const databasePath = process.env.DATABASE_PATH || path.join(dataDirectory, 'bartender.db');
const db = new DatabaseSync(databasePath);

function run(sql, params = []) {
  const result = db.prepare(sql).run(...params);
  return { id: Number(result.lastInsertRowid), changes: Number(result.changes) };
}

function all(sql, params = []) {
  return db.prepare(sql).all(...params);
}

function get(sql, params = []) {
  return db.prepare(sql).get(...params);
}

async function initializeDatabase() {
  await run('PRAGMA foreign_keys = ON');
  await run(`CREATE TABLE IF NOT EXISTS cocktails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    price REAL NOT NULL CHECK (price >= 0),
    is_available INTEGER NOT NULL DEFAULT 1
  )`);
  await run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    cocktail_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity BETWEEN 1 AND 10),
    notes TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'preparing', 'ready')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cocktail_id) REFERENCES cocktails(id)
  )`);

  const row = await get('SELECT COUNT(*) AS count FROM cocktails');
  if (row.count === 0) {
    const cocktails = [
      ['Mojito', 'Bright, minty, and refreshing.', 'White rum, lime, mint, sugar, soda water', 10.00],
      ['Margarita', 'A crisp citrus classic with a salted rim.', 'Tequila, triple sec, lime, agave', 12.00],
      ['Old Fashioned', 'Spirit-forward with bitters and orange.', 'Bourbon, bitters, sugar, orange', 13.00],
      ['Espresso Martini', 'Smooth, rich, and lightly sweet.', 'Vodka, espresso, coffee liqueur', 14.00],
      ['Berry Fizz (Zero Proof)', 'Fruity and sparkling without alcohol.', 'Mixed berries, lime, simple syrup, soda', 8.00]
    ];
    for (const cocktail of cocktails) {
      await run(
        'INSERT INTO cocktails (name, description, ingredients, price) VALUES (?, ?, ?, ?)',
        cocktail
      );
    }
  }
}

module.exports = { db, run, all, get, initializeDatabase };
