// Simple test script to check admin functionality
const fetch = require('node-fetch');

const BACKEND_URL = 'http://localhost:5000';

async function testAdminRoutes() {
  try {
    // Test health endpoint first
    console.log('Testing health endpoint...');
    const healthResponse = await fetch(`${BACKEND_URL}/api/health`);
    console.log('Health status:', healthResponse.status);
    
    // You would need a valid admin token to test the admin routes
    // This is just to check if the routes are accessible
    console.log('Admin routes should be available at:');
    console.log(`${BACKEND_URL}/api/admin/stats`);
    console.log(`${BACKEND_URL}/api/admin/users`);
    console.log(`${BACKEND_URL}/api/admin/items`);
    
  } catch (error) {
    console.error('Error testing admin routes:', error.message);
  }
}

testAdminRoutes();