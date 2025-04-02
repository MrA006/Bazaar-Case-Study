import pkg from 'pg';
const {Client} = pkg;

const client = new Client({
    user: 'postgres',         
    host: 'localhost',         
    database: 'inventory',          
    password: 'postgres',    
    port: 5432,                
});

// console.log('here')

client.connect()
.then(() => console.log('Connected to PostgreSQL'))
.catch(err => console.error('Connection error', err.stack));
  
// Creating tables   
client.query(`
    
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

    --ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;


    CREATE TABLE IF NOT EXISTS stock_movement (
    id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES product(id),
        store_id INTEGER REFERENCES store(id),
        quantity INTEGER NOT NULL,
        type TEXT CHECK(type IN ('stock_in', 'sold', 'removed')),
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
  
  export default client;