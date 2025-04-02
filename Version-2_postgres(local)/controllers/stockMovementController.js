import pool from '../db.js'

export const getAllOperations = async (req,res) => {
    const operations = await pool.query('SELECT * FROM stock_movement',[]);
    res.json(operations.rows);
}

export const performOperation = async (req, res) => {
    const { product_id, quantity, type, store_id, source_store_id, destination_store_id } = req.body;

    if (!['stock_in', 'sold', 'removed', 'returned', 'transferred'].includes(type)) {
        return res.status(400).json({ error: 'Invalid movement type' });
    }

    try {
        await pool.query('BEGIN');

        if (type === 'transferred') {
            if (!source_store_id || !destination_store_id || source_store_id === destination_store_id) {
                return res.status(400).json({ error: 'Invalid transfer details' });
            }

            await pool.query(
                'UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2 AND store_id = $3',
                [quantity, product_id, source_store_id]
            );

            await pool.query(
                'INSERT INTO inventory (product_id, store_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (product_id, store_id) DO UPDATE SET quantity = inventory.quantity + $3',
                [product_id, destination_store_id, quantity]
            );

            await pool.query(
                'INSERT INTO stock_movement (product_id, source_store_id, destination_store_id, quantity, type) VALUES ($1, $2, $3, $4, $5)',
                [product_id, source_store_id, destination_store_id, quantity, type]
            );
        } else {
          
            const adjustment = type === 'stock_in' || type === 'returned' ? quantity : -quantity;

            let result = 
            await pool.query(
                'UPDATE inventory SET quantity = quantity + $1 WHERE product_id = $2 AND store_id = $3',
                [adjustment, product_id, store_id]
            );

            if( result.rowCount == 0){

                await pool.query('ROLLBACK');

                res.status(400).json({ error: "no stock found for operation." });
                return;
            }

            await pool.query(
                'INSERT INTO stock_movement (product_id, source_store_id, quantity, type) VALUES ($1, $2, $3, $4)',
                [product_id, store_id, quantity, type]
            );
        }

        await pool.query('COMMIT'); 
        res.status(201).json({ success: true });
    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(400).json({ error: error.message });
    }
};

