# Voltar API Wrapper

A TypeScript wrapper for the Voltar API, providing easy access to URL bypassing functionality with support for both synchronous and asynchronous operations.

## Installation

```bash
npm install voltar-wrapper
```

## Usage

```typescript
import { Voltar } from 'voltar-wrapper';

// Initialize with your API key
const voltar = new Voltar('your-api-key-here');

// Bypass a URL (synchronous method)
const result = await voltar.bypass('https://example.com/shortlink');

// Bypass a URL with async processing (recommended for potentially slow URLs)
const asyncResult = await voltar.bypassAsync('https://example.com/shortlink');

// Get supported services
const services = await voltar.services();
```

## API Reference

### `new Voltar(apiKey)`

Creates a new Voltar API client instance.

- `apiKey` (string): Your Voltar API key

### `bypass(url, cache?)`

Bypasses a URL using the synchronous Voltar API endpoint.

- `url` (string): The URL to bypass
- `cache` (boolean, optional): Whether to use cached results. Defaults to true
- Returns: Promise with bypass result
- Note: May timeout for URLs that take a long time to process

### `bypassAsync(url, cache?, pollingInterval?, timeout?)`

Bypasses a URL using the asynchronous task-based approach. Recommended for URLs that might take a long time to process.

- `url` (string): The URL to bypass
- `cache` (boolean, optional): Whether to use cached results. Defaults to true
- `pollingInterval` (number, optional): Time in ms between status checks. Defaults to 1000ms
- `timeout` (number, optional): Maximum time in ms to wait for completion. Defaults to 60000ms (1 minute)
- Returns: Promise with the bypass result

### `createBypassTask(url, cache?)`

Creates an asynchronous bypass task.

- `url` (string): The URL to bypass
- `cache` (boolean, optional): Whether to use cached results. Defaults to true
- Returns: Promise with the task creation result containing a taskId

### `getTaskResult(taskId)`

Get the result of an asynchronous bypass task.

- `taskId` (string): The ID of the task to check
- Returns: Promise with the task result

### `services()`

Gets a list of supported services.

- Returns: Promise with list of supported services categorized by type

## Example Usage

### TypeScript

```typescript
// examples/example.ts
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
```

### JavaScript

```javascript
// examples/example.js
const { Voltar } = require('voltar-wrapper');

// Initialize with your API key
const voltar = new Voltar('your-api-key-here');

async function run() {
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
    console.error('Error:', error.message);
  }
} 

// Run the Example
run();
```

## Advanced Usage: Manual Task Management

If you need more control over the task lifecycle:

```typescript
// Create a bypass task
const taskCreation = await voltar.createTask('https://example.com/shortlink');
const taskId = taskCreation.taskId;

// Check the task status periodically
let isComplete = false;
while (!isComplete) {
  const taskResult = await voltar.getTaskResult(taskId);
  
  if (taskResult.status !== 'processing') {
    isComplete = true;
    console.log('Final result:', taskResult);
  } else {
    console.log('Still processing...');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

## License

MIT