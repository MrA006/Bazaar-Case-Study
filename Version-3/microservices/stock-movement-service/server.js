import express from 'express';
import dotenv from 'dotenv';
import swaggerDocs from './API-doc/swagger.js'; 
import operationsRouter from './routes/stockMovementRoutes.js';
import cookieParser from 'cookie-parser';
import { limiter } from './middleware/middleware.js';

dotenv.config();

const app = express();
swaggerDocs(app);


app.use(express.json());
app.use(cookieParser());
app.use(limiter);

app.use('/operations', operationsRouter);



app.listen(3002,()=>{
    console.log('listening to port 3002')
})