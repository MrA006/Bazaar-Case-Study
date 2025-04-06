import express from 'express';
import dotenv from 'dotenv';
import pool from './db.js';
import { startAuditConsumer } from './auditConsumer.js';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/audit', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 100');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

startAuditConsumer();

app.listen(3005, () => {
  console.log('Audit Log Service running on port 3005');
});
