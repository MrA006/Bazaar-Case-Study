import pool from './db.js';
import express from 'express';
import productRouter from './routes/productRoutes.js';
import storeRouter from './routes/storeRoutes.js';
import operationsRouter from './routes/stockMovementRoutes.js';


const app = express();

app.use(express.json());

// app.use(('/', (req,res)=>{
//     res.json("connected")
// }))


app.use('/products', productRouter);
app.use('/stores', storeRouter);
app.use('/operations', operationsRouter);


app.listen(3000,()=>{
    console.log('listening')
})