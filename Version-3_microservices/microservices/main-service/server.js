import express from 'express';
import dotenv from 'dotenv';
import swaggerDocs from './API-doc/swagger.js'; 
import storeRouter from './routes/storeRoutes.js';
import authRouter from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import { limiter } from './middleware/middleware.js';
import initAdmin from './initAdmin.js';
import { initAuditPublisher } from './Utilities/auditPublisher.js';

dotenv.config();

const app = express();
swaggerDocs(app); 


app.use(express.json());
app.use(cookieParser());
app.use(limiter);

app.use('/stores', storeRouter);
app.use('/auth', authRouter);

initAdmin();
initAuditPublisher();

app.listen(3000,()=>{
    console.log('listening on port 3000')
})