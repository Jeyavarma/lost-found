const axios = require('axios');

const createAdmin = async () => {
  try {
    const response = await axios.post('https://lost-found-79xn.onrender.com/api/auth/create-first-admin', {
      name: 'Admin User',
      email: 'admin@mcc.edu.in', 
      password: 'admin123'
    });
    
    console.log('✅ Admin account created successfully!');
    console.log('Email: admin@mcc.edu.in');
    console.log('Password: admin123');
    console.log('Token:', response.data.token);
  } catch (error) {
    if (error.response) {
      console.log('❌ Error:', error.response.data.message);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
};

createAdmin();