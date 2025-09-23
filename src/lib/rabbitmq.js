import amqp from 'amqplib'

class RabbitMQConnection {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:password123@localhost:5672';
      
      this.connection = await amqp.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      
      console.log('Connected to RabbitMQ');
      
      // Handle connection errors
      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
      });
      
      this.connection.on('close', () => {
        console.log('RabbitMQ connection closed');
      });
      
      return this.channel;
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async createQueue(queueName) {
    if (!this.channel) {
      await this.connect();
    }
    
    await this.channel.assertQueue(queueName, {
      durable: true // Queue will survive broker restarts
    });
    
    return queueName;
  }

  async publishToQueue(queueName, message) {
    if (!this.channel) {
      await this.connect();
    }
    
    // Ensure queue exists
    await this.createQueue(queueName);
    
    const messageBuffer = Buffer.from(JSON.stringify(message));
    
    const result = this.channel.sendToQueue(queueName, messageBuffer, {
      persistent: true // Message will survive broker restarts
    });
    
    if (result) {
      console.log(`Message published to queue ${queueName}:`, message);
    } else {
      console.error('Failed to publish message to queue');
    }
    
    return result;
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}

// Create singleton instance
const rabbitMQ = new RabbitMQConnection();

// Export functions for use in API routes
export async function publishAuditJob(jobData) {
  const AUDIT_QUEUE = 'ad-audit-queue';
  
  try {
    const result = await rabbitMQ.publishToQueue(AUDIT_QUEUE, {
      ...jobData,
      timestamp: new Date().toISOString(),
      jobId: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
    
    return result;
  } catch (error) {
    console.error('Error publishing audit job:', error);
    throw error;
  }
}

export async function initializeQueues() {
  const AUDIT_QUEUE = 'ad-audit-queue';
  
  try {
    await rabbitMQ.createQueue(AUDIT_QUEUE);
    console.log('Queues initialized successfully');
  } catch (error) {
    console.error('Error initializing queues:', error);
    throw error;
  }
}

export { rabbitMQ };