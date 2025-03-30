import { Voltar } from 'voltar-wrapper';

// Initialize with your API key
const voltar = new Voltar('your-api-key-here');

async function run(): Promise<void> {
  try {
    // Synchronous bypass (may timeout for slow URLs)
    console.log('Attempting synchronous bypass...');
    try {
      const bypass = await voltar.bypass('https://linkvertise.com/1239053/delta-executor1');
      console.log('Bypass result:', bypass);
    } catch (error) {
      console.log('Synchronous bypass may have timed out, trying async method...');
    }
    
    // Asynchronous bypass (recommended for potentially slow URLs)
    console.log('\nPerforming asynchronous bypass...');
    const asyncBypass = await voltar.bypassAsync('https://linkvertise.com/1239053/delta-executor1');
    console.log('Async bypass result:', asyncBypass);
    
    // Get supported services
    console.log('\nGetting supported services...');
    const services = await voltar.services();
    console.log('Services:', services);
    
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }
}

// Run the example
run();