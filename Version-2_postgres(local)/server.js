import express from 'express';
import productRouter from './routes/productRoutes.js';
import storeRouter from './routes/storeRoutes.js';
import operationsRouter from './routes/stockMovementRoutes.js';
import authRouter from './routes/authRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/products', productRouter);
app.use('/stores', storeRouter);
app.use('/operations', operationsRouter);
app.use('/auth', authRouter);



app.listen(3000,()=>{
    console.log('listening')
})