import pool from '../db.js'

export const getFilteredProducts = async (req,res) => {
    const {searchName, dateRange, store_id} = req.body || {};
    let query = 'SELECT * FROM Product where 1 = 1 ';
    let queryParams = [];
  
    if(searchName){
      queryParams.push(`%${searchName}%`);
      query += `and name ILIKE $${queryParams.length}`;
    }
  
    if(store_id){
      queryParams.push(store_id);
      query += `and store_id = $${queryParams.length}`;
    }
    if (dateRange) {
      // const startDate = new Date(dateRange[0]).toISOString();
      // const endDate = new Date(dateRange[1]).toISOString();
      queryParams.push(dateRange[0], dateRange[1]);
      query += ` AND DATE(timestamp) BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
    }
  
  
    // console.log('query')
    // console.log(query)
    // console.log(dateRange)
    try {
      const products = await pool.query(query,queryParams);
      
      res.json(products.rows);
    } catch (error) {
      res.json(error)
    }
}


export const addProduct = async (req, res) => {
    let { name, stock, store_id } = req.body;
    
    if(!stock) stock = 0;

    try{

        const result = await pool.query('INSERT INTO Product (name, current_quantity, store_id) VALUES ($1, $2, $3)', [name, stock, store_id]);
        res.status(201).json({ rowAdded: result.rowCount });

    }catch(err){
        res.status(400).json(err);
    }
    
}



