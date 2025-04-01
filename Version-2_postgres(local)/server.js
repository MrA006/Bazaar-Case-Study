import pool from './db.js';
import express from 'express';


const app = express();

app.use(express.json());

// app.use(('/', (req,res)=>{
//     res.json("connected")
// }))

//get all products
app.get('/products', async (req,res) => {
  try {
    const products = await pool.query('SELECT * FROM Product',[])
    
    res.json(products.rows);
  } catch (error) {
    req.json(error)
  }
})

//get all operations
app.get('/operations', async (req,res) => {
    const operations = await pool.query('SELECT * FROM stock_movement',[]);
    res.json(operations.rows);
})

// add a product and stock
app.post('/products/additem', async (req, res) => {
    const { name, stock } = req.body;
    
    if(!stock) stock = 0;

    try{

        const result = await pool.query('INSERT INTO Product (name, current_quantity) VALUES ($1, $2)', [name, stock]);
        res.status(201).json({ rowAdded: result.rowCount });

    }catch(err){
        res.status(400).json(err);
    }
    
});
  
// Operation
app.post('/perform_operation', async (req, res) => {
    const { product_id, quantity, type } = req.body;
    
    if (!['stock_in', 'sold', 'removed'].includes(type)) {
      return res.status(400).json({ error: 'Invalid movement type' });
    }
  
    
    try {
      const adjustment = type === 'stock_in' ? quantity : -quantity;
      await pool.query('UPDATE product SET current_quantity = current_quantity + $1 WHERE id = $2',[adjustment, product_id]);
      await pool.query('INSERT INTO stock_movement (product_id, quantity, type) VALUES ($1, $2, $3)', [product_id, quantity, type]);
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

app.listen(3000,()=>{
    console.log('listening')
})