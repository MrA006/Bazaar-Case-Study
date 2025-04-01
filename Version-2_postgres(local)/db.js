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
        current_quantity INTEGER DEFAULT 0 CHECK(current_quantity >= 0)
    );
  
    CREATE TABLE IF NOT EXISTS stock_movement (
        id SERIAL PRIMARY KEY,
        product_id INTEGER,
        quantity INTEGER NOT NULL,
        type TEXT CHECK(type IN ('stock_in', 'sold', 'removed')),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(product_id) REFERENCES product(id)
    );
`);
  
  export default client;