import pkg from 'pg';
const {Pool} = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    user: process.env.user,         
    host: process.env.host,         
    database: process.env.database,          
    password: process.env.password,    
    port: 5432,                
});


pool.on('connect', () => {
    console.log('Connected to PostgreSQL using Pool');
});

pool.on('error', (err) => {
    console.error('Error in PostgreSQL connection:', err);
});


pool.query(`
    
    CREATE TABLE IF NOT EXISTS Product (
        id SERIAL PRIMARY KEY ,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT ,
        created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  
    
    CREATE TABLE IF NOT EXISTS Store (
        id SERIAL PRIMARY KEY ,
        name VARCHAR(50) NOT NULL UNIQUE,
        address VARCHAR(50) NOT NULL UNIQUE
    );

        
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        store_id INTEGER REFERENCES store(id),
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'store_manager', 'viewer')),
        is_active BOOLEAN DEFAULT TRUE, 
        last_login TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );


    CREATE TABLE IF NOT EXISTS stock_movement (
    id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES product(id),
        store_id INTEGER REFERENCES store(id),
        quantity INTEGER NOT NULL,
        type TEXT CHECK(type IN ('stock_in', 'sold', 'removed', 'returned')),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );  


    CREATE TABLE IF NOT EXISTS inventory (
        product_id INTEGER REFERENCES product(id),
        store_id INTEGER REFERENCES store(id),
        quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
        last_updated TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (product_id, store_id)
    );

`);
  
  export default pool;