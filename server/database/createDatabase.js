import db from './connection.js'
import bcrypt from 'bcrypt'

const deleteMode = process.argv.includes('--delete')

if (deleteMode) {
  await db.exec(`DROP TABLE IF EXISTS users; DROP TABLE IF EXISTS fridge_items;`)
}

await db.exec(`
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE COLLATE NOCASE,
    username VARCHAR(100) UNIQUE COLLATE NOCASE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS fridge_items(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    quantity INTEGER NOT NULL,
    last_restocked TEXT NOT NULL,
    in_need INTEGER DEFAULT 0
);
`)

const hashedPassword1 = await bcrypt.hash('password123', 10)
await db.run(`INSERT INTO users (email, username, password) VALUES (?, ?, ?)`, [
  'anders1@example.com',
  'anders',
  hashedPassword1
])

const hashedPassword2 = await bcrypt.hash('password123', 10)
await db.run(`INSERT INTO users (email, username, password) VALUES (?, ?, ?)`, [
  'david1@example.com',
  'david',
  hashedPassword2
])

const hashedPassword3 = await bcrypt.hash('admin', 10)
await db.run(`INSERT INTO users (email, username, password) VALUES (?, ?, ?)`, [
  'admin@admin.com',
  'admin',
  hashedPassword3
])

const fridge_seed1 = await db.run(
  `INSERT INTO fridge_items (name, quantity, last_restocked, in_need) VALUES (?, ?, ?, ?)`,
  ['Milk', 2, '2026-05-27', 0]
)
const fridge_seed2 = await db.run(
  `INSERT INTO fridge_items (name, quantity, last_restocked, in_need) VALUES (?, ?, ?, ?)`,
  ['Eggs', 12, '2026-05-27', 0]
)

const fridge_seed3 = await db.run(
  `INSERT INTO fridge_items (name, quantity, last_restocked, in_need) VALUES (?, ?, ?, ?)`,
  ['Butter', 0, '2026-05-24', 1]
)

const fridge_seed4 = await db.run(
  `INSERT INTO fridge_items (name, quantity, last_restocked, in_need) VALUES (?, ?, ?, ?)`,
  ['Koldskål', 1, '2026-05-26', 1]
)

const fridge_seed5 = await db.run(
  `INSERT INTO fridge_items (name, quantity, last_restocked, in_need) VALUES (?, ?, ?, ?)`,
  ['Faxe Kondi Free', 3, '2026-05-06', 0]
)

const fridge_seed6 = await db.run(
  `INSERT INTO fridge_items (name, quantity, last_restocked, in_need) VALUES (?, ?, ?, ?)`,
  ['Chicken breast', 2, '2026-05-26', 1]
)
