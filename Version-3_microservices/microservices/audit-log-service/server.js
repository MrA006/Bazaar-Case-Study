import express from 'express';
import dotenv from 'dotenv';
import { startAuditConsumer } from './auditConsumer.js';

dotenv.config();

const app = express();
app.use(express.json());

startAuditConsumer();

app.listen(3005, () => {
  console.log('Audit Log Service running on port 3005');
});
