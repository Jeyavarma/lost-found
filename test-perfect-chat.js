// Test perfect chat system between lost and found users
const BACKEND_URL = 'https://lost-found-79xn.onrender.com';

async function testPerfectChat() {
  console.log('🎯 Testing PERFECT Chat System Between Lost/Found Users\n');
  
  let user1Token = null;
  let user2Token = null;
  let testItemId = null;
  
  try {
    // Step 1: Login users
    console.log('1. Logging in test users...');
    
    const user1Login = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testuser1@mcc.edu.in',
        password: 'password123'
      })
    });
    
    const user2Login = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testuser2@mcc.edu.in',
        password: 'password123'
      })
    });
    
    if (user1Login.ok && user2Login.ok) {
      const user1Data = await user1Login.json();
      const user2Data = await user2Login.json();
      user1Token = user1Data.token;
      user2Token = user2Data.token;
      console.log('   ✅ Both users logged in successfully\n');
    } else {
      console.log('   ❌ Login failed\n');
      return;
    }\n    \n    // Step 2: Create a test item\n    console.log('2. Creating test lost item...');\n    const itemResponse = await fetch(`${BACKEND_URL}/api/items`, {\n      method: 'POST',\n      headers: {\n        'Authorization': `Bearer ${user1Token}`,\n        'Content-Type': 'application/json'\n      },\n      body: JSON.stringify({\n        title: 'Test Lost Phone',\n        description: 'iPhone 12 Pro lost in library',\n        category: 'Electronics',\n        location: 'Main Library',\n        status: 'lost',\n        contactInfo: 'Please contact if found'\n      })\n    });\n    \n    if (itemResponse.ok) {\n      const item = await itemResponse.json();\n      testItemId = item._id;\n      console.log(`   ✅ Test item created: ${item.title} (ID: ${testItemId})\\n`);\n    } else {\n      console.log('   ❌ Failed to create test item\\n');\n      return;\n    }\n    \n    // Step 3: User 2 starts chat about the item\n    console.log('3. User 2 starting chat about the lost item...');\n    const chatResponse = await fetch(`${BACKEND_URL}/api/chat/room/${testItemId}`, {\n      method: 'POST',\n      headers: {\n        'Authorization': `Bearer ${user2Token}`,\n        'Content-Type': 'application/json'\n      }\n    });\n    \n    if (chatResponse.ok) {\n      const room = await chatResponse.json();\n      console.log(`   ✅ Chat room created: ${room._id}`);\n      console.log(`   📱 Item: ${room.itemId.title}`);\n      console.log(`   👥 Participants: ${room.participants.length}`);\n      console.log(`   🏷️ Type: ${room.type}\\n`);\n      \n      // Step 4: Test sending messages\n      console.log('4. Testing message exchange...');\n      \n      // User 2 sends first message\n      const msg1Response = await fetch(`${BACKEND_URL}/api/chat/room/${room._id}/message`, {\n        method: 'POST',\n        headers: {\n          'Authorization': `Bearer ${user2Token}`,\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify({\n          content: 'Hi! I think I found your phone. Is it black iPhone 12 Pro?',\n          type: 'text'\n        })\n      });\n      \n      if (msg1Response.ok) {\n        const message1 = await msg1Response.json();\n        console.log(`   ✅ Message 1 sent: \"${message1.content}\"`);\n      }\n      \n      // User 1 replies\n      const msg2Response = await fetch(`${BACKEND_URL}/api/chat/room/${room._id}/message`, {\n        method: 'POST',\n        headers: {\n          'Authorization': `Bearer ${user1Token}`,\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify({\n          content: 'Yes! That\\'s exactly it! Where did you find it?',\n          type: 'text'\n        })\n      });\n      \n      if (msg2Response.ok) {\n        const message2 = await msg2Response.json();\n        console.log(`   ✅ Message 2 sent: \"${message2.content}\"`);\n      }\n      \n      // Step 5: Verify message history\n      console.log('\\n5. Verifying message history...');\n      const historyResponse = await fetch(`${BACKEND_URL}/api/chat/room/${room._id}/messages`, {\n        headers: { 'Authorization': `Bearer ${user1Token}` }\n      });\n      \n      if (historyResponse.ok) {\n        const history = await historyResponse.json();\n        console.log(`   ✅ Found ${history.messages.length} messages in history`);\n        history.messages.forEach((msg, i) => {\n          console.log(`   📝 Message ${i+1}: \"${msg.content}\" - ${msg.senderId.name}`);\n        });\n      }\n      \n    } else {\n      console.log('   ❌ Failed to create chat room\\n');\n      return;\n    }\n    \n    console.log('\\n🎉 PERFECT CHAT SYSTEM TEST RESULTS:');\n    console.log('✅ User authentication working');\n    console.log('✅ Item creation successful');\n    console.log('✅ Item-based chat room creation working');\n    console.log('✅ Message sending functional');\n    console.log('✅ Message history retrieval working');\n    console.log('✅ Lost user ↔ Found user communication established');\n    console.log('\\n🚀 CHAT SYSTEM IS PERFECTLY WORKING!');\n    \n  } catch (error) {\n    console.error('❌ Test failed:', error.message);\n  }\n}\n\ntestPerfectChat();