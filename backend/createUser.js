require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fgms');
    console.log('Connected to MongoDB');

    // Check if user exists
    const existingUser = await User.findOne({ email: 'admin@test.com' });
    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      return;
    }

    // Create new user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = new User({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: hashedPassword
    });

    await user.save();
    console.log('User created successfully:', user.email);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

createUser();
