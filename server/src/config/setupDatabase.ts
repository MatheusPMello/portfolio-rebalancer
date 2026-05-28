import { db } from './db.js';

const createTablesQuery = `
  DROP TABLE IF EXISTS assets;
  DROP TABLE IF EXISTS users CASCADE;

  CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE assets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      name VARCHAR(100) NOT NULL,
      target_percentage DECIMAL(5, 2) NOT NULL,
      current_value DECIMAL(12, 2) NOT NULL,
      currency VARCHAR(3) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );
`;

async function setupDatabase(): Promise<void> {
  console.log('Setting up database...');
  try {
    await db.query(createTablesQuery);
    console.log('Database tables created successfully!');
  } catch (err) {
    console.error('Error creating database tables:', err);
  }
}

setupDatabase();
