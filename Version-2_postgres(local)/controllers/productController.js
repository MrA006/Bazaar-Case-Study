import pool from '../db.js'

export const getFilteredProducts = async (req,res) => {
    const {searchName, dateRange, store_id} = req.body || {};
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
  
    try {
      const products = await pool.query(query,queryParams);
      
      res.json(products.rows);
    } catch (error) {
      res.json(error)
    }
}


export const addProduct = async (req, res) => {
    let { name, description } = req.body;

    if(!name){
      return res.status(400).json({ message: "Missing required fields" });
    }

    try{

        const result = await pool.query('INSERT INTO Product (name, description) VALUES ($1, $2)', [name, description]);
        res.status(201).json({ rowAdded: result.rowCount });

    }catch(err){
        res.status(400).json(err);
    }
    
}



