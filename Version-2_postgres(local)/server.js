import express from 'express';
import dotenv from 'dotenv';
import swaggerDocs from './API-doc/swagger.js'; 
import productRouter from './routes/productRoutes.js';
import storeRouter from './routes/storeRoutes.js';
import operationsRouter from './routes/stockMovementRoutes.js';
import authRouter from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import { limiter } from './middleware/middleware.js';

dotenv.config();

const app = express();
swaggerDocs(app); // using swagger for API-documentation


app.use(express.json());
app.use(cookieParser());
app.use(limiter);

app.use('/products', productRouter);
app.use('/stores', storeRouter);
app.use('/operations', operationsRouter);
app.use('/auth', authRouter);



app.listen(3000,()=>{
    console.log('listening')
})