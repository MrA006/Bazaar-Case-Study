import pool from '../db.js'


export const getAllStores =  async (req,res) => {
    const operations = await pool.query('SELECT * FROM store',[]);
    res.json(operations.rows);
}


export const addStore = async (req, res) => {
    const { name, address } = req.body;
  
    const client = await pool.connect();
    try{
        
        client.query("BEGIN");

        const result = await client.query('INSERT INTO Store (name, address) VALUES ($1, $2)', [name, address]);
        res.status(201).json({ rowAdded: result.rowCount });
  
        client.query("COMMIT");
  
    }catch(err){
        client.query("ROLLBACK");

        res.status(400).json(err);
    }finally{
        client.release();

    }
    
}

