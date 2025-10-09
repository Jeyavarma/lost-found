require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});

    // Create sample users
    const users = await User.create([
      {
        name: 'John Student',
        email: 'student@mcc.edu.in',
        password: 'password123',
        role: 'student',
        studentId: 'MCC2024001',
        shift: 'aided',
        department: 'bsc-cs',
        year: '2'
      },
      {
        name: 'Jane Staff',
        email: 'staff@mcc.edu.in',
        password: 'password123',
        role: 'staff'
      },
      {
        name: 'Admin User',
        email: 'admin@mcc.edu.in',
        password: 'password123',
        role: 'admin'
      }
    ]);

    // Create sample items
    await Item.create([
      {
        title: 'Lost iPhone 13',
        description: 'Black iPhone 13 with blue case',
        category: 'electronics',
        location: 'library',
        status: 'lost',
        reportedBy: users[0]._id,
        contactInfo: 'student@mcc.edu.in',
        timeReported: '2:30 PM',
        locationDetails: {
          building: 'Main Library',
          floor: '2nd Floor',
          room: 'Reading Hall'
        }
      },
      {
        title: 'Found Wallet',
        description: 'Brown leather wallet with ID cards',
        category: 'personal',
        location: 'cafeteria',
        status: 'found',
        reportedBy: users[1]._id,
        contactInfo: 'staff@mcc.edu.in',
        timeReported: '1:15 PM',
        locationDetails: {
          building: 'Student Cafeteria',
          floor: 'Ground Floor',
          room: 'Near Counter 3'
        }
      },
      {
        title: 'Found Samsung Earbuds',
        description: 'White Samsung Galaxy Buds in charging case',
        category: 'electronics',
        location: 'sports-complex',
        status: 'found',
        reportedBy: users[1]._id,
        contactInfo: 'staff@mcc.edu.in',
        timeReported: '4:45 PM',
        locationDetails: {
          building: 'Sports Complex',
          floor: 'Ground Floor',
          room: 'Basketball Court'
        }
      },
      {
        title: 'Lost Blue Notebook',
        description: 'Blue spiral notebook with Physics notes',
        category: 'books',
        location: 'main-building',
        status: 'lost',
        reportedBy: users[0]._id,
        contactInfo: 'student@mcc.edu.in',
        timeReported: '11:20 AM',
        locationDetails: {
          building: 'Academic Block A',
          floor: '3rd Floor',
          room: 'Room 301'
        }
      }
    ]);

    console.log('Sample data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();