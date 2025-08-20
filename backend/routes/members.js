const express = require('express');
const Member = require('../models/Member');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log('\n=== New Request ===');
  console.log('Time:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));
  console.log('Params:', JSON.stringify(req.params, null, 2));
  console.log('==================\n');
  next();
});

// Create member - Fixed route to handle POST /api/members
router.post('/', auth, async (req, res) => {
  try {
    console.log('\n=== Creating New Member ===');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    
    const { name, number, membership, expiry, picture } = req.body;

    // Validate required fields
    if (!name) {
      console.log('Error: Name is required');
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    if (!number) {
      console.log('Error: Phone number is required');
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }

    if (!membership) {
      console.log('Error: Membership type is required');
      return res.status(400).json({
        success: false,
        error: 'Membership type is required'
      });
    }

    if (!expiry) {
      console.log('Error: Expiry date is required');
      return res.status(400).json({
        success: false,
        error: 'Expiry date is required'
      });
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(number)) {
      console.log('Error: Invalid phone number format');
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit phone number'
      });
    }

    // Check if member with same phone number exists
    console.log('Checking for existing member with phone:', number);
    const existingMember = await Member.findOne({ number });
    if (existingMember) {
      console.log('Error: Member with this phone number already exists:', existingMember);
      return res.status(400).json({ 
        success: false,
        error: 'A member with this phone number already exists' 
      });
    }

    // Create new member
    console.log('Creating new member with data:', {
      name,
      number,
      membership,
      expiry: new Date(expiry),
      picture
    });

    const member = new Member({
      name,
      number,
      membership,
      expiry: new Date(expiry),
      picture,
      joined: new Date()
    });

    // Save member with proper error handling
    console.log('Attempting to save member to database');
    const savedMember = await member.save();
    console.log('Member saved successfully:', savedMember);

    res.status(201).json({
      success: true,
      data: savedMember
    });
  } catch (err) {
    console.error('\n=== Error Creating Member ===');
    console.error('Error:', err);
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Request body:', req.body);
    console.error('===========================\n');

    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        error: Object.values(err.errors).map(val => val.message).join(', ')
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'Server error while creating member',
      details: err.message
    });
  }
});

// Get all members with pagination and filtering
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching members with query:', req.query);
    const { 
      page = 1, 
      limit = 10, 
      isActive, 
      membership,
      startDate,
      endDate
    } = req.query;

    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (membership) {
      query.membership = membership;
    }
    if (startDate || endDate) {
      query.joined = {};
      if (startDate) query.joined.$gte = new Date(startDate);
      if (endDate) query.joined.$lte = new Date(endDate);
    }

    console.log('Executing query:', query);
    const members = await Member.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    console.log(`Found ${members.length} members`);

    const count = await Member.countDocuments(query);
    console.log('Total members count:', count);

    res.json({
      success: true,
      data: {
        members,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (err) {
    console.error('Error fetching members:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    res.status(500).json({ 
      success: false,
      error: 'Server error while fetching members'
    });
  }
});

// Get single member
router.get('/:id', auth, async (req, res) => {
  try {
    console.log('Fetching member with ID:', req.params.id);
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      console.log('Member not found:', req.params.id);
      return res.status(404).json({ 
        success: false,
        error: 'Member not found' 
      });
    }
    
    console.log('Member found:', member);
    res.json({
      success: true,
      data: member
    });
  } catch (err) {
    console.error('Error fetching member:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    res.status(500).json({ 
      success: false,
      error: 'Server error while fetching member'
    });
  }
});

// Update member
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('Updating member:', req.params.id);
    console.log('Update data:', req.body);
    const { name, number, membership, expiry, picture, isActive } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (number) updateData.number = number;
    if (membership) updateData.membership = membership;
    if (expiry) updateData.expiry = new Date(expiry);
    if (picture) updateData.picture = picture;
    if (isActive !== undefined) updateData.isActive = isActive;

    console.log('Final update data:', updateData);
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!member) {
      console.log('Member not found for update:', req.params.id);
      return res.status(404).json({ 
        success: false,
        error: 'Member not found' 
      });
    }

    console.log('Member updated successfully:', member);
    res.json({
      success: true,
      data: member
    });
  } catch (err) {
    console.error('Error updating member:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        error: Object.values(err.errors).map(val => val.message).join(', ')
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'Server error while updating member'
    });
  }
});

// Delete member (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Deleting member:', req.params.id);
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!member) {
      console.log('Member not found for deletion:', req.params.id);
      return res.status(404).json({ 
        success: false,
        error: 'Member not found' 
      });
    }

    console.log('Member deactivated successfully:', member);
    res.json({ 
      success: true,
      message: 'Member deactivated successfully'
    });
  } catch (err) {
    console.error('Error deleting member:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    res.status(500).json({ 
      success: false,
      error: 'Server error while deleting member'
    });
  }
});

module.exports = router;
//r=come to chat