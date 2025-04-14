import { publishAuditEvent } from '../Utilities/auditPublisher.js';
import { readPool, writePool } from '../db.js';
import redisClient from '../Utilities/redisClient.js';

export const getFilteredProducts = async (req,res) => {
  const {searchName, startDate, endDate, store_id} = req.query || {};
  let query = 'SELECT * FROM Product p JOIN inventory i on p.id = i.product_id where 1 = 1 ';
  let queryParams = [];

  if(searchName){
    queryParams.push(`%${searchName}%`);
    query += `and p.name ILIKE $${queryParams.length} `;
  }

  if(store_id){
    queryParams.push(store_id);
    query += `and i.store_id = $${queryParams.length} `;
  }

  if (startDate && endDate) {
    queryParams.push(startDate, endDate);
    query += `AND DATE(p.created_At) BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
  }

  const cacheKey = `products:${searchName || 'all'}:${startDate || 'none'}:${endDate || 'none'}:${store_id || 'all'}`;


  try {
    const cachedProducts = await redisClient.get(cacheKey);
    if (cachedProducts) {
      console.log('Returning cached data');
      return res.json(JSON.parse(cachedProducts));
    }

    const products = await readPool.query(query,queryParams);

    await redisClient.set(cacheKey, JSON.stringify(products.rows), { EX: 60 });

    res.json(products.rows);
  } catch (error) {
    res.json(error)
  }
}

export const addProduct = async (req, res) => {
  let { name, description } = req.body;
  const userId = req.user?.id || null;

  if (!name) {
      return res.status(400).json({ message: "Missing required fields" });
  }
  
  const client = await writePool.connect();

  try {

      await client.query("BEGIN");
      const result = await client.query(
          "INSERT INTO Product (name, description) VALUES ($1, $2) RETURNING *",
          [name, description]
      );

      const newProduct = result.rows[0];

      const auditEvent = {
          service: "product",
          operation: "INSERT",
          userId,
          tableName: "Product",
          recordId: newProduct.id,
          newData: newProduct,
          timestamp: new Date().toISOString()
      };
      await publishAuditEvent(auditEvent);

      await client.query("COMMIT");

      const keys = await redisClient.keys("products:*");
      if (keys.length > 0) {
        await redisClient.del(keys);
      }

      res.status(201).json({ rowAdded: result.rowCount, newProduct });

  } catch (err) {
      await client.query("ROLLBACK");

      res.status(400).json({ error: err.message });
  }finally {
      client.release();
  }
};


