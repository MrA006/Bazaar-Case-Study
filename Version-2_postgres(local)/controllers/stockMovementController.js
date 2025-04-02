import pool from '../db.js'

export const getAllOperations = async (req,res) => {
    const operations = await pool.query('SELECT * FROM stock_movement',[]);
    res.json(operations.rows);
}

export const performOperation = async (req, res) => {
    const { product_id, quantity, type } = req.body;
    
    if (!['stock_in', 'sold', 'removed'].includes(type)) {
      return res.status(400).json({ error: 'Invalid movement type' });
    }
  
    try {
      const adjustment = type === 'stock_in' ? quantity : -quantity;
      await pool.query('UPDATE product SET current_quantity = current_quantity + $1 WHERE id = $2',[adjustment, product_id]);
      await pool.query('INSERT INTO stock_movement (product_id, quantity, type) VALUES ($1, $2, $3)', [product_id, quantity, type]);
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}