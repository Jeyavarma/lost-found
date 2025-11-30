// Simple test for perfect chat system
const BACKEND_URL = 'https://lost-found-79xn.onrender.com';

async function testSimpleChat() {
  console.log('🎯 Testing Perfect Chat System\n');
  
  try {
    // Test 1: Login
    console.log('1. Testing login...');
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
      console.log('   ✅ Login successful\n');
      
      // Test 2: Create item
      console.log('2. Creating test item...');
      const itemResponse = await fetch(`${BACKEND_URL}/api/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Lost Phone',
          description: 'iPhone lost in library',
          category: 'Electronics',
          location: 'Library',
          status: 'lost'
        })
      });
      
      if (itemResponse.ok) {
        const item = await itemResponse.json();
        console.log(`   ✅ Item created: ${item.title}\n`);
        
        // Test 3: Create chat room
        console.log('3. Creating chat room...');
        const chatResponse = await fetch(`${BACKEND_URL}/api/chat/room/${item._id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (chatResponse.ok) {
          const room = await chatResponse.json();
          console.log(`   ✅ Chat room created: ${room._id}`);
          console.log(`   📱 Item: ${room.itemId.title}`);
          console.log(`   👥 Participants: ${room.participants.length}\n`);
          
          console.log('🎉 PERFECT CHAT SYSTEM IS WORKING!');
          console.log('✅ Authentication working');
          console.log('✅ Item creation working');
          console.log('✅ Item-based chat creation working');
          console.log('✅ Ready for lost ↔ found user communication');
          
        } else {
          console.log('   ❌ Chat room creation failed');
        }
      } else {
        console.log('   ❌ Item creation failed');
      }
    } else {
      console.log('   ❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSimpleChat();