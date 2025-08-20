require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Member = require('../models/Member');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fgms');
    console.log('✅ Connected to MongoDB for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Member.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@fgms.com',
      password: hashedPassword
    });
    await adminUser.save();
    console.log('👤 Created admin user (email: admin@fgms.com, password: admin123)');

    // Create sample members
    const sampleMembers = [
      {
        name: 'John Doe',
        number: '1234567890',
        membership: 'Monthly',
        expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        picture: 'https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg',
        joined: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        attendance: [
          {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            checkIn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000)
          },
          {
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            checkIn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000)
          }
        ]
      },
      {
        name: 'Jane Smith',
        number: '0987654321',
        membership: 'Quarterly',
        expiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        picture: 'https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg',
        joined: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        attendance: [
          {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            checkIn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000)
          }
        ]
      },
      {
        name: 'Mike Johnson',
        number: '5555555555',
        membership: 'Yearly',
        expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 365 days from now
        picture: 'https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg',
        joined: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        attendance: []
      },
      {
        name: 'Sarah Wilson',
        number: '1111111111',
        membership: 'Monthly',
        expiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Expiring in 2 days
        picture: 'https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg',
        joined: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 days ago
        attendance: [
          {
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            checkIn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000)
          }
        ]
      },
      {
        name: 'Bob Brown',
        number: '2222222222',
        membership: 'Monthly',
        expiry: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Expired 5 days ago
        picture: 'https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg',
        joined: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
        isActive: false,
        attendance: []
      }
    ];

    for (const memberData of sampleMembers) {
      const member = new Member(memberData);
      await member.save();
    }

    console.log(`👥 Created ${sampleMembers.length} sample members`);
    console.log('✅ Database seeded successfully!');
    
    console.log('\n📊 Summary:');
    console.log('- Admin login: admin@fgms.com / admin123');
    console.log('- Sample members with various membership statuses');
    console.log('- Some members have attendance records');
    console.log('- One member is expiring soon');
    console.log('- One member is already expired');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

const runSeeder = async () => {
  await connectDB();
  await seedData();
};

runSeeder();
