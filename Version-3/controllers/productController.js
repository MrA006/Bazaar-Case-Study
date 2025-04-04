import pool from '../db.js'
import logAudit from '../Utilities/auditLogger.js';

export const getFilteredProducts = async (req,res) => {
    const {searchName, dateRange, store_id} = req.query || {};
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
    if (dateRange) {
      queryParams.push(dateRange[0], dateRange[1]);
      query += `AND DATE(p.created_At) BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
    }
  
    // console.log(query)
    // console.log(queryParams)
    try {
      const products = await pool.query(query,queryParams);
      
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
  
  const client = await pool.connect();

  try {

      await client.query("BEGIN");
      const result = await client.query(
          "INSERT INTO Product (name, description) VALUES ($1, $2) RETURNING *",
          [name, description]
      );

      const newProduct = result.rows[0];

      await logAudit(client, {
          service: "product",
          operation: "INSERT",
          userId,
          tableName: "Product",
          recordId: newProduct.id,
          newData: newProduct
      });

      await client.query("COMMIT");

      res.status(201).json({ rowAdded: result.rowCount, newProduct });

  } catch (err) {
      await client.query("ROLLBACK");

      res.status(400).json({ error: err.message });
  }finally {
      client.release();
  }
};


