import Database from 'better-sqlite3';
const db = new Database('inventory.db');
  
// Create tables
db.exec(`
    
    CREATE TABLE IF NOT EXISTS Product (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        current_quantity INTEGER DEFAULT 0 CHECK(current_quantity >= 0)
    );
  
    CREATE TABLE IF NOT EXISTS stock_movement (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        quantity INTEGER NOT NULL,
        type TEXT CHECK(type IN ('stock_in', 'sold', 'removed')),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(product_id) REFERENCES product(id)
    );
  `);
  
  export default db;