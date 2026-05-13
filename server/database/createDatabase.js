import db from './connection.js'
import bcrypt from 'bcrypt'

// process.argv.find((argument) => argument === '--delete')

const deleteMode = process.argv.includes('--delete')

if(deleteMode) {
    await db.exec(`DROP TABLE IF EXISTS users; DROP TABLE IF EXISTS fridge_items;`)

}

/*How to run
.exec() //Run DCL/DDL (With no parameters)
.run() //Run queries with no return value (INSERT, UPDATE, DELETE)
.all() // Run a query and retrieve the result set ( SELECT)
*/

/*
Conventions for SQL
- Use snake_case for table and column names.
- Plural for tables
- Use lowercase for table and column names.
*/

//DDL
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
`
)

// DML

// Seeding
const hashedPassword1 = await bcrypt.hash('password123', 10)
await db.run(`INSERT INTO users (email, username, password) VALUES (?, ?, ?)`, ['anders1@example.com', 'anders', hashedPassword1])

const hashedPassword2 = await bcrypt.hash('admin', 10)
await db.run(`INSERT INTO users (email, username, password) VALUES (?, ?, ?)`, ['admin@admin.com', 'admin', hashedPassword2])

const fridge_seed1 = await db.run(`INSERT INTO fridge_items (name, quantity, last_restocked, in_need) VALUES (?, ?, ?, ?)`, ['yoghurt', 2, '2026-05-09', 1])
const fridge_seed2 = await db.run(`INSERT INTO fridge_items (name, quantity, last_restocked, in_need) VALUES (?, ?, ?, ?)`, ['eggs', 12, '2026-05-06', 0])