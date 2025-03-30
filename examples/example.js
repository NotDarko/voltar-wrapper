const { Voltar } = require('voltar-wrapper');

// Initialize with your API key
const voltar = new Voltar('your-api-key-here');


async function run() {
  try {
    // Bypass a URL
    console.log('Bypassing URL...');
    const bypass = await voltar.bypass('https://linkvertise.com/1239053/delta-executor1');
    console.log('Bypass result:', bypass);
    
    // Get supported services
    console.log('\nGetting supported services...');
    const services = await voltar.services();
    console.log('Ad Links:', services.adlinks);
    console.log('Key Systems:', services.keysystems);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
run();