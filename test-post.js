// Simple script to test POST requests to the quote request endpoint
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testPostRequest() {
  try {
    // Create a test form data
    const form = new FormData();
    
    // Add form fields
    form.append('name', 'Test User');
    form.append('email', 'test@example.com');
    form.append('material', 'PLA');
    form.append('quantity', '1');
    form.append('notes', 'This is a test submission from Node.js');
    
    // Create a test file if it doesn't exist
    const testFilePath = path.join(__dirname, 'test-cube.stl');
    if (!fs.existsSync(testFilePath)) {
      console.log('Creating test STL file...');
      // Create a minimal STL file content (not a valid 3D model, just for testing)
      const content = 'solid test\nendsolid test';
      fs.writeFileSync(testFilePath, content);
    }
    
    // Add the test file
    form.append('models', fs.createReadStream(testFilePath));
    
    // Add profile summary
    const profilesSummary = {
      global: {
        material: 'PLA',
        quantity: 1,
        color: 'Black',
        finish: 'Standard'
      },
      perFile: [{
        name: 'test-cube.stl',
        profile: {
          material: 'Use global setting',
          quantity: 'Use global setting',
          color: 'Use global setting',
          finish: 'Use global setting',
          notes: 'None'
        }
      }]
    };
    form.append('profiles_summary', JSON.stringify(profilesSummary));
    
    // Set server URL
    const serverUrl = 'http://localhost:3001/submit-quote-request';
    
    console.log(`Sending POST request to ${serverUrl}...`);
    
    // Send the request
    const response = await fetch(serverUrl, {
      method: 'POST',
      body: form,
      headers: {
        'Accept': 'application/json',
        ...form.getHeaders()
      }
    });
    
    // Log response details
    console.log('Response status:', response.status, response.statusText);
    console.log('Response headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    // Try to parse as JSON
    try {
      const jsonResponse = await response.json();
      console.log('Response JSON:', JSON.stringify(jsonResponse, null, 2));
    } catch (error) {
      // If JSON parsing fails, get as text
      const textResponse = await response.text();
      console.error('Failed to parse as JSON. Response text:', textResponse);
    }
    
  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Run the test
testPostRequest(); 