import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

// Initialize SQL database file path
const DB_FILE = path.join(process.cwd(), "data.db");

// Initialize sqlite3 database connection
export const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite data.db:", err);
  } else {
    console.log("Connected to SQL database (SQLite) successfully at data.db");
    initializeTables();
  }
});

// Create tables in SQL format
function initializeTables() {
  db.serialize(() => {
    // Read table info to see if we have old schema format, if so, migrate
    db.all("PRAGMA table_info(users)", (err, rows) => {
      if (err) {
        console.error("Error checking table info for users:", err);
        createTables();
        return;
      }

      const hasOldId = rows && rows.some((col: any) => col.name === "id");
      const hasUserId = rows && rows.some((col: any) => col.name === "user_id");

      if (hasOldId || (rows && rows.length > 0 && !hasUserId)) {
        console.log("Old users schema format detected. Re-creating tables with the updated schema...");
        db.serialize(() => {
          db.run("DROP TABLE IF EXISTS analyses");
          db.run("DROP TABLE IF EXISTS users");
          createTables();
        });
      } else {
        createTables();
      }
    });
  });
}

function createTables() {
  // 1. Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      user_id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role TEXT CHECK(role IN ('JOB_SEEKER', 'EMPLOYER', 'ADMIN')) DEFAULT 'JOB_SEEKER' NOT NULL,
      full_name VARCHAR(150),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP,
      del_flg BOOLEAN DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error("Error creating users table in SQL database:", err);
    } else {
      console.log("SQL Table 'users' verified/created with updated schema.");
    }
  });

  // 2. Resumes Table
  db.run(`
    CREATE TABLE IF NOT EXISTS resumes (
      resume_id VARCHAR(36) PRIMARY KEY,
      seeker_id VARCHAR(36) NOT NULL,
      file_url VARCHAR(500) NOT NULL,
      file_type TEXT CHECK(file_type IN ('PDF', 'DOCX')) DEFAULT 'PDF' NOT NULL,
      detected_skills TEXT,
      is_analyzed BOOLEAN DEFAULT 0 NOT NULL,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      del_flg BOOLEAN DEFAULT 0,
      FOREIGN KEY(seeker_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error("Error creating resumes table in SQL database:", err);
    } else {
      console.log("SQL Table 'resumes' verified/created with user parameters.");
    }
  });

  // 3. Analyses Table (Relational User Storage)
  db.run(`
    CREATE TABLE IF NOT EXISTS analyses (
      id TEXT PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      name TEXT NOT NULL,
      parsed_data TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error("Error creating analyses table in SQL database:", err);
    } else {
      console.log("SQL Table 'analyses' verified/created.");
    }
  });
}

// Relational query helper functions with callbacks wrapped in Promises for async/await
export function sqlGet<T>(query: string, params: any[] = []): Promise<T | null> {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve((row as T) || null);
      }
    });
  });
}

export function sqlAll<T>(query: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve((rows as T[]) || []);
      }
    });
  });
}

export function sqlRun(query: string, params: any[] = []): Promise<{ lastId: any; changes: number }> {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastId: this.lastID, changes: this.changes });
      }
    });
  });
}
