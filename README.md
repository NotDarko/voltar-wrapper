# Voltar API Wrapper
A TypeScript wrapper for the Voltar API, providing easy access to URL bypassing functionality.

## Installation
```bash
npm install voltar-wrapper
```

## Usage

## API Reference
### new Voltar(apiKey)
Creates a new Voltar API client instance.
- apiKey (string): Your Voltar API key

### bypass(url, cache)
Bypasses a URL using Voltar API.
- url (string): The URL to bypass
- cache (boolean, optional): Whether to use cached results. Defaults to true
- Returns: Promise with bypass result

### services()
Gets a list of supported services.
- Returns: Promise with list of supported services


## Example Usage
```typescript
// examples/example.ts
import { Voltar } from 'voltar-wrapper';

// Initialize with your API key
const voltar = new Voltar('your-api-key-here');

async function run(): Promise<void> {
  try {
    // Bypass a URL
    console.log('Bypassing URL...');
    const bypass = await voltar.bypass('https://linkvertise.com/1239053/delta-executor1');
    console.log('Bypass result:', bypass);
    
    // Get supported services
    console.log('\nGetting supported services...');
    const services = await voltar.services();
    console.log('Supported services:', services);
    
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
  }
}

// Run the example
run();
```



```javascript
// examples/example.js
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
    console.log('Supported services:', services);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
run();
```

## License
MIT