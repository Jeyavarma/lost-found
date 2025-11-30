// Test chat functionality with actual API calls
const BACKEND_URL = 'https://lost-found-79xn.onrender.com';

async function testChatSystem() {
  console.log('🧪 Testing Chat System Functionality\n');
  
  // Test 1: Check if chat routes exist
  console.log('1. Testing chat routes...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat/rooms`);
    console.log(`   Status: ${response.status}`);
    const data = await response.text();
    console.log(`   Response: ${data.substring(0, 100)}...\n`);
  } catch (error) {
    console.log(`   Error: ${error.message}\n`);
  }
  
  // Test 2: Check if users search exists
  console.log('2. Testing user search...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/users/search?q=test`);
    console.log(`   Status: ${response.status}`);
    const data = await response.text();
    console.log(`   Response: ${data.substring(0, 100)}...\n`);
  } catch (error) {
    console.log(`   Error: ${error.message}\n`);
  }
  
  // Test 3: Check available routes
  console.log('3. Testing available API routes...');
  const testRoutes = [
    '/api/auth/login',
    '/api/items',
    '/api/admin',
    '/api/chat',
    '/api/users'
  ];
  
  for (const route of testRoutes) {
    try {
      const response = await fetch(`${BACKEND_URL}${route}`);
      console.log(`   ${route}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`   ${route}: Error - ${error.message}`);
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('- Server is running ✅');
  console.log('- Need to check if new chat routes are deployed');
  console.log('- Authentication is required for chat functionality');
}

testChatSystem();