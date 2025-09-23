import { initializeQueues } from './rabbitmq';

// Initialize queues when the application starts
export async function initializeApplication() {
  try {
    console.log('Initializing application...');
    
    // Initialize RabbitMQ queues
    await initializeQueues();
    
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    // Don't throw error to prevent app from crashing
    // The app should still work, but queue operations might fail
  }
}

// Auto-initialize when this module is imported
initializeApplication();