import pool from '../db.js'

export const getAllOperations = async (req,res) => {
    const operations = await pool.query('SELECT * FROM stock_movement',[]);
    res.json(operations.rows);
}

export const performOperation = async (req, res) => {
    const { product_id, quantity, type, store_id } = req.body;
  
    if (!['stock_in', 'sold', 'removed', 'returned'].includes(type)) {
      return res.status(400).json({ error: 'Invalid movement type' });
    }
  
    if (!(req.user.role === 'store_manager' && req.user.store_id === store_id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied: You are not manager of this store.' });
    }
  
    try {
      await pool.query('BEGIN');

      const adjustment = (type === 'stock_in' || type === 'returned') ? quantity : -quantity;
  
      let updateResult = await pool.query(
        'UPDATE inventory SET quantity = quantity + $1 WHERE product_id = $2 AND store_id = $3',
        [adjustment, product_id, store_id]
      );
  
      if (updateResult.rowCount === 0 && !(type === 'stock_in' || type === 'returned')) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: 'No stock found for removal operation.' });
      }else{
        updateResult = await pool.query(
            'INSERT INTO inventory (quantity, product_id ,store_id) VALUES ($1, $2, $3)',
            [adjustment, product_id, store_id]
        );
      }

  
      await pool.query(
        'INSERT INTO stock_movement (product_id, store_id, quantity, type) VALUES ($1, $2, $3, $4)',
        [product_id, store_id, quantity, type]
      );
  
      await pool.query('COMMIT');
      res.status(201).json({ success: true });
    } catch (error) {
      await pool.query('ROLLBACK');
      res.status(400).json({ error: error.message });
    }
  };
  

