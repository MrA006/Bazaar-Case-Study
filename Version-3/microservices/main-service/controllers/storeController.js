import { readPool, writePool } from '../db.js';

import { publishAuditEvent } from '../Utilities/auditPublisher.js';
import redisClient from '../Utilities/redisClient.js';


export const getAllStores = async (req, res) => {
    try {
        const cached = await redisClient.get('stores:all');
        if (cached){ 
          console.log('Returning cached data');

            return res.json(JSON.parse(cached));
        }

        const operations = await readPool.query('SELECT * FROM store');
        await redisClient.set('stores:all', JSON.stringify(operations.rows), { EX: 60 });

        res.json(operations.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const addStore = async (req, res) => {
    const { name, address } = req.body;
    const userId = req.user.id;
  
    const client = await writePool.connect();
    try {

        await client.query("BEGIN");

        const result = await client.query(
            'INSERT INTO Store (name, address) VALUES ($1, $2) RETURNING id',
            [name, address]
        );

        const storeId = result.rows[0].id;

        const auditEvent = {
            service: "store_management",
            operation: "INSERT",
            userId,
            tableName: "Store",
            recordId: storeId,
            newData: { name, address },
            timestamp: new Date().toISOString()
        };

        await publishAuditEvent(auditEvent);

        await client.query("COMMIT")
        
        await redisClient.del("stores:all");

        res.status(201).json({ rowAdded: result.rowCount, storeId });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error adding store:", err);
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
};

