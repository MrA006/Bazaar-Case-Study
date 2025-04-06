// Utilities/auditPublisher.js
import amqp from 'amqplib';

// const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:password@localhost';
const RABBITMQ_URL = 'amqp://user:password@rabbitmq:5672';
const QUEUE = 'audit_log_queue';

let channel = null;

// Initialize RabbitMQ connection and channel
export const initAuditPublisher = async () => {
  try {
    console.log('here')
    const connection = await amqp.connect(RABBITMQ_URL);
    console.log('here connected')

    channel = await connection.createChannel();
    console.log('here created ')

    await channel.assertQueue(QUEUE, { durable: true });
    console.log('Audit publisher initialized.');
  } catch (error) {
    console.error('Failed to initialize audit publisher:', error);
  }
};

// Publish an audit event to the queue
export const publishAuditEvent = async (auditEvent) => {
  if (!channel) {
    console.error('Audit publisher channel not initialized');
    return;
  }
  try {
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(auditEvent)), {
      persistent: true,
    });
    console.log('Audit event published:', auditEvent);
  } catch (error) {
    console.error('Error publishing audit event:', error);
  }
};
