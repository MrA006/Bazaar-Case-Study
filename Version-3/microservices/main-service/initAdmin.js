import pool from './db.js';
import bcrypt from 'bcrypt';

export const initAdmin = async () => {
    const client = await pool.connect();
    
    try {
      const checkResult = await client.query(
        'SELECT * FROM users WHERE role = $1', 
        ['admin']
      );
      
      if (checkResult.rows.length === 0) {
        await client.query('BEGIN');
        
        const username = process.env.INIT_ADMIN_USERNAME || 'admin';
        const password = process.env.INIT_ADMIN_PASSWORD || 'admin';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const result = await client.query(
          `INSERT INTO users (username, password_hash, role, is_active)
           VALUES ($1, $2, $3, TRUE)
           RETURNING id, username, role, is_active`,
          [username, hashedPassword, 'admin']
        );
  
        await client.query('COMMIT');
        console.log('Initial admin user created:', username, password);
      }
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error creating initial admin:', err);
    } finally {
      client.release();
    }
  };


export default initAdmin;