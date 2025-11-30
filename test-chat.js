// Simple test to check chat functionality
const BACKEND_URL = 'https://lost-found-79xn.onrender.com';

async function testChat() {
  try {
    // Test 1: Check if chat routes are accessible
    console.log('Testing chat routes...');
    
    const response = await fetch(`${BACKEND_URL}/api/chat/rooms`, {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    
    const data = await response.text();
    console.log('Chat rooms response:', data);
    
    // Test 2: Check if users search works
    const usersResponse = await fetch(`${BACKEND_URL}/api/users/search?q=test`, {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    
    const usersData = await usersResponse.text();
    console.log('Users search response:', usersData);
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testChat();