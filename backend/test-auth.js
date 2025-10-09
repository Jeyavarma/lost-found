const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

// Test data
const testUser = {
  name: 'Test Student',
  email: 'test.student@mcc.edu.in',
  phone: '+91 9876543210',
  studentId: 'MCC2024TEST',
  shift: 'aided',
  department: 'bsc-cs',
  year: '2',
  rollNumber: 'MCC2024TEST',
  password: 'testpass123'
};

async function testAuth() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Register new user
    console.log('1️⃣ Testing Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/register`, testUser);
    console.log('✅ Registration successful');
    console.log('Token:', registerResponse.data.token.substring(0, 20) + '...');
    console.log('User:', registerResponse.data.name);
    console.log('Role:', registerResponse.data.role);

    // Test 2: Login with created user
    console.log('\n2️⃣ Testing Login...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful');
    console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');
    console.log('User:', loginResponse.data.name);
    console.log('Role:', loginResponse.data.role);

    // Test 3: Test duplicate registration
    console.log('\n3️⃣ Testing Duplicate Registration...');
    try {
      await axios.post(`${BASE_URL}/register`, testUser);
      console.log('❌ Should have failed');
    } catch (error) {
      console.log('✅ Correctly rejected duplicate user');
      console.log('Error:', error.response.data.message);
    }

    // Test 4: Test wrong password
    console.log('\n4️⃣ Testing Wrong Password...');
    try {
      await axios.post(`${BASE_URL}/login`, {
        email: testUser.email,
        password: 'wrongpassword'
      });
      console.log('❌ Should have failed');
    } catch (error) {
      console.log('✅ Correctly rejected wrong password');
      console.log('Error:', error.response.data.message);
    }

    console.log('\n🎉 All tests passed! Authentication system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

// Run tests
testAuth();