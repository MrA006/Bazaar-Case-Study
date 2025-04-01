import db from './db.js';
import express from 'express';


const app = express();

app.use(express.json());

// app.use(('/', (req,res)=>{
//     res.json("connected")
// }))


//prepare sql queries tobe used
const allItemsQuery = db.prepare('SELECT * FROM Product');
const allOperationsQuery = db.prepare('SELECT * FROM stock_movement');
const insertItemQuery = db.prepare('INSERT INTO Product (name, current_quantity) VALUES (?, ?)');
const insertOperationQuery = db.prepare(`INSERT INTO stock_movement (product_id, quantity, type) VALUES (?, ?, ?)`);
const updateStockQuery = db.prepare(`UPDATE product SET current_quantity = current_quantity + ? WHERE id = ?`);

//get all products
app.get('/products', (req,res) => {
    const products = allItemsQuery.all();
    res.json(products);
})

//get all operations
app.get('/operations', (req,res) => {
    const products = allOperationsQuery.all();
    res.json(products);
})

// add a product and stock
app.post('/products/additem', (req, res) => {
    const { name, stock } = req.body;
    
    if(!stock) stock = 0

    // console.log('here')


    try{

        const result = insertItemQuery.run(name, stock);
        res.status(201).json({ id: result.lastInsertRowid });

    }catch(err){
        res.status(400).json(err)
    }
    
});
  
// Operation
app.post('/perform_operation', (req, res) => {
    const { product_id, quantity, type } = req.body;
    
    if (!['stock_in', 'sold', 'removed'].includes(type)) {
      return res.status(400).json({ error: 'Invalid movement type' });
    }
  
    const transaction = db.transaction(() => {
      insertOperationQuery.run(product_id, quantity, type);
      const adjustment = type === 'stock_in' ? quantity : -quantity;
      updateStockQuery.run(adjustment, product_id);
    });
  
    try {
      transaction();
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

app.listen(3000,()=>{
    console.log('listening')
})