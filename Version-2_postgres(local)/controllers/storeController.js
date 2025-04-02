import pool from '../db.js'


export const getAllStores =  async (req,res) => {
    const operations = await pool.query('SELECT * FROM store',[]);
    res.json(operations.rows);
}


export const addStore = async (req, res) => {
    const { name, address } = req.body;
  
    try{
  
        const result = await pool.query('INSERT INTO Store (name, address) VALUES ($1, $2)', [name, address]);
        res.status(201).json({ rowAdded: result.rowCount });
  
    }catch(err){
        res.status(400).json(err);
    }
    
}

