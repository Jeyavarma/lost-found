// Debug test to see what's happening
const BACKEND_URL = 'https://lost-found-79xn.onrender.com';

async function debugTest() {
  console.log('🔍 Debug Test\n');
  
  try {
    // Login
    const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testuser1@mcc.edu.in',
        password: 'password123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      const token = loginData.token;
      console.log('✅ Login successful');
      
      // Try creating item
      const itemResponse = await fetch(`${BACKEND_URL}/api/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Lost Phone',
          description: 'Test description',
          category: 'Electronics',
          location: 'Library',
          status: 'lost',
          contactName: 'Test User',
          contactEmail: 'test@mcc.edu.in'
        })
      });
      
      console.log('Item response status:', itemResponse.status);
      const itemText = await itemResponse.text();
      console.log('Item response:', itemText);
      
      if (itemResponse.ok) {
        const item = JSON.parse(itemText);
        console.log('Item created:', item);
        
        // Try creating chat
        const chatResponse = await fetch(`${BACKEND_URL}/api/chat/room/${item._id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Chat response status:', chatResponse.status);
        const chatText = await chatResponse.text();
        console.log('Chat response:', chatText);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

debugTest();