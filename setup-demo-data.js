const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/lost-found', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
  studentId: String,
  department: String,
  year: String,
  createdAt: { type: Date, default: Date.now }
});

// Item Schema
const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  categoryOther: String,
  status: { type: String, enum: ['lost', 'found'], required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  time: String,
  currentLocation: String,
  culturalEvent: String,
  culturalEventOther: String,
  contactName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: String,
  itemImageUrl: String,
  locationImageUrl: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Item = mongoose.model('Item', itemSchema);

// Demo users data
const demoUsers = [
  {
    name: "Harish Kumar",
    email: "harish.kumar@mcc.edu.in",
    password: "password123",
    role: "student",
    studentId: "MCC2022CS001",
    department: "Computer Science",
    year: "III Year"
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@mcc.edu.in", 
    password: "password123",
    role: "student",
    studentId: "MCC2023MA002",
    department: "Mathematics",
    year: "II Year"
  },
  {
    name: "Rajesh Patel",
    email: "rajesh.patel@mcc.edu.in",
    password: "password123", 
    role: "student",
    studentId: "MCC2021EN003",
    department: "English Literature",
    year: "IV Year"
  }
];

// Demo items data
const demoItems = [
  {
    title: "MacBook Pro 13\" Silver",
    description: "Silver MacBook Pro with MCC stickers and programming notes. Lost during Data Structures lab session.",
    category: "Mobile Phone",
    status: "lost",
    location: "Computer Science Lab, 2nd Floor",
    date: new Date('2024-01-15'),
    time: "14:30",
    contactName: "Harish Kumar",
    contactEmail: "harish.kumar@mcc.edu.in",
    contactPhone: "+91 9876543210",
    culturalEvent: "",
    userIndex: 0
  },
  {
    title: "Blue Backpack with Books",
    description: "Navy blue backpack containing Mathematics textbooks and calculator. Found near library entrance.",
    category: "Books",
    status: "found",
    location: "Central Library Entrance",
    date: new Date('2024-01-16'),
    time: "10:15",
    currentLocation: "Library Lost & Found Counter",
    contactName: "Priya Sharma", 
    contactEmail: "priya.sharma@mcc.edu.in",
    contactPhone: "+91 9876543211",
    culturalEvent: "",
    userIndex: 1
  },
  {
    title: "Student ID Card - Rajesh Patel",
    description: "Student ID card for Rajesh Patel, English Literature Department. Found in cafeteria.",
    category: "ID Card",
    status: "found",
    location: "Main Cafeteria",
    date: new Date('2024-01-17'),
    time: "12:45",
    currentLocation: "Security Office",
    contactName: "Rajesh Patel",
    contactEmail: "rajesh.patel@mcc.edu.in", 
    contactPhone: "+91 9876543212",
    culturalEvent: "",
    userIndex: 2
  },
  {
    title: "Black Wallet with Cards",
    description: "Black leather wallet containing ID cards and some cash. Lost near sports ground.",
    category: "Wallet",
    status: "lost", 
    location: "Sports Ground Parking",
    date: new Date('2024-01-18'),
    time: "16:20",
    contactName: "Harish Kumar",
    contactEmail: "harish.kumar@mcc.edu.in",
    contactPhone: "+91 9876543210",
    culturalEvent: "",
    userIndex: 0
  },
  {
    title: "Scientific Calculator Casio",
    description: "Casio fx-991ES Plus calculator with name written on back. Found in Mathematics classroom.",
    category: "Other",
    categoryOther: "Calculator",
    status: "found",
    location: "Mathematics Block, Room 201", 
    date: new Date('2024-01-19'),
    time: "09:30",
    currentLocation: "Mathematics Department Office",
    contactName: "Priya Sharma",
    contactEmail: "priya.sharma@mcc.edu.in",
    contactPhone: "+91 9876543211",
    culturalEvent: "",
    userIndex: 1
  },
  {
    title: "Red Water Bottle",
    description: "Red stainless steel water bottle with MCC logo. Lost during cultural event.",
    category: "Other",
    categoryOther: "Water Bottle", 
    status: "lost",
    location: "Centenary Hall",
    date: new Date('2024-01-20'),
    time: "18:00",
    contactName: "Rajesh Patel",
    contactEmail: "rajesh.patel@mcc.edu.in",
    contactPhone: "+91 9876543212",
    culturalEvent: "Annual Day 2024",
    userIndex: 2
  }
];

// Create demo images (placeholder files)
function createDemoImages() {
  const uploadsDir = path.join(__dirname, 'backend', 'uploads');
  
  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Create simple text files as demo images
  const demoImageData = [
    'MacBook Pro Image Data',
    'Backpack Image Data', 
    'ID Card Image Data',
    'Wallet Image Data',
    'Calculator Image Data',
    'Water Bottle Image Data'
  ];

  demoImageData.forEach((data, index) => {
    const filename = `demo-item-${index + 1}.jpg`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, data);
    console.log(`✅ Created demo image: ${filename}`);
  });

  return demoImageData.map((_, index) => `/uploads/demo-item-${index + 1}.jpg`);
}

async function setupDemoData() {
  try {
    console.log('🚀 Setting up demo data...');

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create demo images
    const imageUrls = createDemoImages();

    // Create demo users
    const createdUsers = [];
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`✅ Created user: ${userData.name} (${userData.email})`);
    }

    // Create demo items
    for (let i = 0; i < demoItems.length; i++) {
      const itemData = demoItems[i];
      const user = createdUsers[itemData.userIndex];
      
      const item = new Item({
        ...itemData,
        userId: user._id,
        itemImageUrl: imageUrls[i] || null,
        locationImageUrl: i % 2 === 0 ? imageUrls[i] : null // Some items have location images
      });
      
      await item.save();
      console.log(`✅ Created item: ${itemData.title} (${itemData.status})`);
    }

    console.log('\n🎉 Demo data setup complete!');
    console.log('\n👥 Test Users Created:');
    demoUsers.forEach(user => {
      console.log(`   📧 ${user.email} | 🔑 ${user.password}`);
    });
    
    console.log('\n📱 You can now:');
    console.log('   1. Login with any of the test users');
    console.log('   2. View the demo items on the homepage');
    console.log('   3. Test the report forms');
    console.log('   4. See images in the uploads folder');

  } catch (error) {
    console.error('❌ Error setting up demo data:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the setup
setupDemoData();