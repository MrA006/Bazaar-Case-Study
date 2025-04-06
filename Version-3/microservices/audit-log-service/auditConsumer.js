import amqp from 'amqplib';
import pool from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const RABBITMQ_URL = 'amqp://user:password@rabbitmq:5672';
const QUEUE = 'audit_log_queue';


let retryCount = 0;

export const startAuditConsumer = async () => {
  const connectToRabbitMQ = async () => {
    try {
      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();
      await channel.assertQueue(QUEUE, { durable: true });
      // console.log('Audit consumer started, waiting for messages...');

      channel.consume(QUEUE, async (msg) => {
        if (msg !== null) {
          const auditEvent = JSON.parse(msg.content.toString());
          // console.log('Received audit event:', auditEvent);
          try {
            await pool.query(
              `INSERT INTO audit_log (service, operation, user_id, table_name, record_id, previous_data, new_data, timestamp)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [
                auditEvent.service,
                auditEvent.operation,
                auditEvent.userId,
                auditEvent.tableName,
                auditEvent.recordId,
                auditEvent.previousData ? JSON.stringify(auditEvent.previousData) : null,
                auditEvent.newData ? JSON.stringify(auditEvent.newData) : null,
                auditEvent.timestamp
              ]
            );
            channel.ack(msg);
          } catch (error) {
            console.error("Error inserting audit log:", error);
            channel.nack(msg, false, false);
          }
        }
      });
    } catch (error) {
      console.error("Audit consumer error:", error);

    }
  };

  connectToRabbitMQ();
};

startAuditConsumer();
