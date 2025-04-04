import pool from '../db.js'
import logAudit from '../Utilities/auditLogger.js';


export const getAllStores =  async (req,res) => {
    const operations = await pool.query('SELECT * FROM store',[]);
    res.json(operations.rows);
}


export const addStore = async (req, res) => {
    const { name, address } = req.body;
    const userId = req.user.id;
  
    const client = await pool.connect();
    try {

        await client.query("BEGIN");

        const result = await client.query(
            'INSERT INTO Store (name, address) VALUES ($1, $2) RETURNING id',
            [name, address]
        );

        const storeId = result.rows[0].id;

        await logAudit(client, {
            service: "store_management",
            operation: "INSERT",
            userId,
            tableName: "Store",
            recordId: storeId,
            newData: { name, address }
        });

        await client.query("COMMIT")
        res.status(201).json({ rowAdded: result.rowCount, storeId });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error adding store:", err);
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
};

