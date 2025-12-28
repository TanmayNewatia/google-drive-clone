import sqlite3 from "sqlite3";
import { mkdirSync, existsSync } from "fs";
import { dirname } from "path";

// Database file path
const DB_PATH = "./var/db/drive.db";
const DB_DIR = dirname(DB_PATH);

// Ensure the database directory exists
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
}

// Create database instance with proper typing
const db = new sqlite3.Database(DB_PATH);

// Database schema interfaces
export interface User {
  id: number;
  username: string;
  hashed_password: Buffer;
  salt: Buffer;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface FederatedCredential {
  id: number;
  user_id: number;
  provider: string;
  subject: string;
}

export interface File {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number; // in bytes
  mime_type: string;
  owner_id: number;
  created_at: string; // ISO date string
  modified_at: string; // ISO date string
  uploaded_at: string; // ISO date string
  is_deleted: number; // SQLite uses INTEGER for boolean (0/1) - soft delete
}

// Database initialization with error handling
const initializeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize((): void => {
      const createTables = [
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY,
          username TEXT UNIQUE,
          hashed_password BLOB,
          salt BLOB,
          name TEXT,
          email TEXT UNIQUE,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now'))
        )`,
        `CREATE TABLE IF NOT EXISTS federated_credentials (
          id INTEGER PRIMARY KEY,
          user_id INTEGER NOT NULL,
          provider TEXT NOT NULL,
          subject TEXT NOT NULL,
          UNIQUE (provider, subject),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS files (
          id INTEGER PRIMARY KEY,
          filename TEXT NOT NULL,
          original_name TEXT NOT NULL,
          file_path TEXT NOT NULL UNIQUE,
          file_size INTEGER DEFAULT 0,
          mime_type TEXT,
          owner_id INTEGER NOT NULL,
          created_at TEXT DEFAULT (datetime('now')),
          modified_at TEXT DEFAULT (datetime('now')),
          uploaded_at TEXT DEFAULT (datetime('now')),
          is_deleted INTEGER DEFAULT 0,
          FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
        )`,
        `CREATE INDEX IF NOT EXISTS idx_files_owner ON files(owner_id)`,
        `CREATE INDEX IF NOT EXISTS idx_files_deleted ON files(is_deleted)`,
      ];

      let completed = 0;
      const total = createTables.length;

      createTables.forEach((sql: string, index: number) => {
        db.run(sql, (err: Error | null) => {
          if (err) {
            console.error(`Error creating table ${index + 1}:`, err);
            reject(err);
            return;
          }

          completed++;
          if (completed === total) {
            console.log("Database initialized successfully");
            resolve();
          }
        });
      });
    });
  });
};

// Initialize database tables
initializeDatabase().catch((error: Error) => {
  console.error("Failed to initialize database:", error);
  process.exit(1);
});

// Database utility functions with proper typing
export const dbUtils = {
  // Get database instance
  getDatabase(): sqlite3.Database {
    return db;
  },

  // Close database connection
  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      db.close((err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  // Run a query with parameters
  run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      db.run(
        sql,
        params,
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) {
            reject(err);
          } else {
            resolve(this);
          }
        }
      );
    });
  },

  // Get a single row
  get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err: Error | null, row: T) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Get all rows
  all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err: Error | null, rows: T[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
};

// File-specific database operations
export const fileDb = {
  // Create a new file record
  async createFile(fileData: Omit<File, "id">): Promise<number> {
    const sql = `
      INSERT INTO files (
        filename, original_name, file_path, file_size, mime_type, 
        owner_id, created_at, modified_at, uploaded_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await dbUtils.run(sql, [
      fileData.filename,
      fileData.original_name,
      fileData.file_path,
      fileData.file_size,
      fileData.mime_type,
      fileData.owner_id,
      fileData.created_at,
      fileData.modified_at,
      fileData.uploaded_at,
    ]);
    return result.lastID!;
  },

  // Get files by owner
  async getFilesByOwner(
    ownerId: number,
    includeDeleted: boolean = false
  ): Promise<File[]> {
    const sql = `
      SELECT * FROM files 
      WHERE owner_id = ? ${includeDeleted ? "" : "AND is_deleted = 0"}
      ORDER BY filename ASC
    `;
    return await dbUtils.all<File>(sql, [ownerId]);
  },

  // Get file by id
  async getFileById(fileId: number): Promise<File | undefined> {
    const sql = "SELECT * FROM files WHERE id = ? AND is_deleted = 0";
    return await dbUtils.get<File>(sql, [fileId]);
  },

  // Update file metadata
  async updateFile(fileId: number, updates: Partial<File>): Promise<void> {
    const fields = Object.keys(updates).filter((key) => key !== "id");
    const sql = `
      UPDATE files 
      SET ${fields
        .map((field) => `${field} = ?`)
        .join(", ")}, modified_at = datetime('now')
      WHERE id = ?
    `;
    const values = [
      ...fields.map((field) => updates[field as keyof File]),
      fileId,
    ];
    await dbUtils.run(sql, values);
  },

  // Soft delete file
  async deleteFile(fileId: number): Promise<void> {
    const sql =
      "UPDATE files SET is_deleted = 1, modified_at = datetime('now') WHERE id = ?";
    await dbUtils.run(sql, [fileId]);
  },

  // Search files by name
  async searchFiles(query: string, ownerId: number): Promise<File[]> {
    const sql = `
      SELECT * FROM files 
      WHERE (filename LIKE ? OR original_name LIKE ?) 
      AND owner_id = ? AND is_deleted = 0
      ORDER BY filename ASC
    `;
    const searchTerm = `%${query}%`;
    return await dbUtils.all<File>(sql, [searchTerm, searchTerm, ownerId]);
  },

  // Rename file
  async renameFile(fileId: number, newFilename: string): Promise<void> {
    const sql = `
      UPDATE files 
      SET filename = ?, modified_at = datetime('now')
      WHERE id = ?
    `;
    await dbUtils.run(sql, [newFilename, fileId]);
  },
};

export default db;
