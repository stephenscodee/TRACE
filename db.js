const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
require("dotenv").config();

async function initDB() {
  const db = await open({
    filename: path.join(__dirname, process.env.DB_PATH || "trace.db"),
    driver: sqlite3.Database,
  });

  // Create Tables
  await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT DEFAULT 'comercial'
        );

        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            company TEXT,
            email TEXT,
            phone TEXT,
            status TEXT DEFAULT 'lead', 
            potential_value REAL DEFAULT 0,
            tags TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER,
            type TEXT, -- 'email', 'call', 'note', 'meeting'
            content TEXT,
            user_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS opportunities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER,
            name TEXT,
            stage TEXT, -- 'prospecting', 'meeting', 'negotiation', 'closed_won', 'closed_lost'
            value REAL,
            est_close_date DATE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id)
        );
    `);

  // Insert dummy admin if not exists
  const admin = await db.get("SELECT * FROM users WHERE email = ?", [
    "admin@trace.com",
  ]);
  if (!admin) {
    await db.run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Admin Trace", "admin@trace.com", "admin123", "admin"]
    );
  }

  return db;
}

module.exports = { initDB };
