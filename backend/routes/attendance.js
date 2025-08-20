const express = require('express');
const Member = require('../models/Member');
const auth = require('../middleware/auth');
const router = express.Router();

// Mark attendance for a specific member
router.post('/:id/attendance', auth, async (req, res) => {
  try {
    console.log('Marking attendance for member ID:', req.params.id);
    
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ 
        success: false,
        error: 'Member not found' 
      });
    }

    // Mark attendance using the member's method
    await member.markAttendance();
    await member.save();
    
    console.log('Attendance marked successfully for member:', req.params.id);
    res.json({ 
      success: true,
      message: 'Attendance marked successfully',
      data: {
        member: member,
        attendance: member.attendance
      }
    });
  } catch (err) {
    console.error('Error marking attendance:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error while marking attendance',
      details: err.message
    });
  }
});

// Legacy route for backward compatibility
router.post('/', auth, async (req, res) => {
  try {
    console.log('Legacy attendance route - redirecting to new format');
    const { memberId } = req.body;
    
    if (!memberId) {
      return res.status(400).json({ 
        success: false,
        error: 'memberId is required' 
      });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ 
        success: false,
        error: 'Member not found' 
      });
    }

    await member.markAttendance();
    await member.save();
    
    res.json({ 
      success: true,
      message: 'Attendance marked successfully',
      data: {
        member: member,
        attendance: member.attendance
      }
    });
  } catch (err) {
    console.error('Error marking attendance:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error while marking attendance',
      details: err.message
    });
  }
});

// Get attendance for a member
router.get('/:id', auth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ 
        success: false,
        error: 'Member not found' 
      });
    }
    res.json({ 
      success: true,
      data: member.attendance 
    });
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error while fetching attendance' 
    });
  }
});

// Get all attendance records (for reports)
router.get('/', auth, async (req, res) => {
  try {
    const members = await Member.find({ isActive: true });
    const attendanceRecords = [];
    
    members.forEach(member => {
      member.attendance.forEach(record => {
        attendanceRecords.push({
          memberId: member._id,
          memberName: member.name,
          date: record.date,
          checkIn: record.checkIn,
          checkOut: record.checkOut
        });
      });
    });
    
    res.json({ 
      success: true,
      data: attendanceRecords 
    });
  } catch (err) {
    console.error('Error fetching all attendance:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error while fetching attendance records' 
    });
  }
});

module.exports = router;
