import pool from '../db.js'
import { publishAuditEvent } from '../Utilities/auditPublisher.js';


export const getAllOperations = async (req,res) => {
    const operations = await pool.query('SELECT * FROM stock_movement',[]);
    res.json(operations.rows);
}

export const performOperation = async (req, res) => {
  const { product_id, quantity, type, store_id } = req.body;

  // console.log(product_id, quantity, type, store_id);

  if (!['stock_in', 'sold', 'removed', 'returned'].includes(type)) {
    return res.status(400).json({ error: 'Invalid movement type' });
  }

  if (!(req.user.role === 'store_manager' && req.user.store_id === store_id) && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Permission denied: You are not manager of this store.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'SELECT quantity FROM inventory WHERE product_id = $1 AND store_id = $2',
      [product_id, store_id]
    );
    const previousQuantity = rows.length ? rows[0].quantity : 0;
    
    const adjustment = (type === 'stock_in' || type === 'returned') ? quantity : -quantity;


    let updateResult = await client.query(
      'UPDATE inventory SET quantity = quantity + $1 WHERE product_id = $2 AND store_id = $3 RETURNING quantity',
      [adjustment, product_id, store_id]
    );
    
    let newQuantity;

    if (updateResult.rowCount === 0) {
      if (type === 'stock_in' || type === 'returned') {
          updateResult = await client.query(
              'INSERT INTO inventory (quantity, product_id, store_id) VALUES ($1, $2, $3) RETURNING quantity',
              [adjustment, product_id, store_id]
          );
          newQuantity = updateResult.rows[0].quantity;
      } else {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: 'No stock found for removal operation.' });
      }
    } else {
        newQuantity = updateResult.rows[0].quantity;
    }
    
    await client.query(
      'INSERT INTO stock_movement (product_id, store_id, quantity, type) VALUES ($1, $2, $3, $4)',
      [product_id, store_id, quantity, type]
    );

    const auditEvent = {
        service: "stock-movement",
        operation: "UPDATE",
        userId: req.user.id,
        tableName: "inventory",
        recordId: product_id,
        newData: { quantity: newQuantity },
        timestamp: new Date().toISOString()
    };
    await publishAuditEvent(auditEvent);

    await client.query('COMMIT');
    res.status(201).json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
};

  

