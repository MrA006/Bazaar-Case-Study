import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';
const { Pool } = pkg;



const pool = new Pool({
    user: process.env.DB_USER,  
    host: process.env.DB_HOST, 
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 10, 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000
});


pool.on('connect', () => {
    console.log('Connected to PostgreSQL using Pool');
});

pool.on('error', (err) => {
    console.error('Error in PostgreSQL connection:', err);
});

// pool.query(`
    
//     CREATE TABLE IF NOT EXISTS Product (
//         id SERIAL PRIMARY KEY ,
//         name VARCHAR(50) NOT NULL UNIQUE,
//         description TEXT ,
//         created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
  
    
//     CREATE TABLE IF NOT EXISTS Store (
//         id SERIAL PRIMARY KEY ,
//         name VARCHAR(50) NOT NULL UNIQUE,
//         address VARCHAR(50) NOT NULL UNIQUE
//     );

        
//     CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         username VARCHAR(50) UNIQUE NOT NULL,
//         password_hash TEXT NOT NULL,
//         store_id INTEGER REFERENCES store(id),
//         role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'store_manager', 'viewer')),
//         is_active BOOLEAN DEFAULT TRUE, 
//         last_login TIMESTAMPTZ,
//         created_at TIMESTAMPTZ DEFAULT NOW()
//     );


//     CREATE TABLE IF NOT EXISTS stock_movement (
//     id SERIAL PRIMARY KEY,
//         product_id INTEGER REFERENCES product(id),
//         store_id INTEGER REFERENCES store(id),
//         quantity INTEGER NOT NULL,
//         type TEXT CHECK(type IN ('stock_in', 'sold', 'removed', 'returned')),
//         timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );  


//     CREATE TABLE IF NOT EXISTS inventory (
//         product_id INTEGER REFERENCES product(id),
//         store_id INTEGER REFERENCES store(id),
//         quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
//         last_updated TIMESTAMPTZ DEFAULT NOW(),
//         PRIMARY KEY (product_id, store_id)
//     );


//     CREATE TABLE IF NOT EXISTS audit_log (
//         id SERIAL PRIMARY KEY,
//         service VARCHAR(50) NOT NULL,  
//         operation VARCHAR(50) NOT NULL,
//         user_id INTEGER, 
//         table_name VARCHAR(50) NOT NULL,
//         record_id INTEGER,
//         previous_data JSONB,
//         new_data JSONB, 
//         timestamp TIMESTAMPTZ DEFAULT NOW()
//     );


// `);
  
  export default pool;