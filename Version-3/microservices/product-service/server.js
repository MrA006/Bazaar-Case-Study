import express from 'express';
import dotenv from 'dotenv';
import swaggerDocs from './API-doc/swagger.js'; 
import productRouter from './routes/productRoutes.js';
import cookieParser from 'cookie-parser';
import { limiter } from './middleware/middleware.js';
import cors from 'cors'; 

dotenv.config();

const app = express();
swaggerDocs(app);


app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.use(cors());



app.use('/products', productRouter);



app.listen(3001,()=>{
    console.log('listening on port 3001')
})