const express = require('express');
const Member = require('../models/Member');
const auth = require('../middleware/auth');
const router = express.Router();

// Membership report: active/inactive members
router.get('/status', auth, async (req, res) => {
  try {
    const active = await Member.countDocuments({ isActive: true });
    const inactive = await Member.countDocuments({ isActive: false });
    res.json({ active, inactive });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Attendance report: total attendance per member
router.get('/attendance', auth, async (req, res) => {
  try {
    const members = await Member.find().populate('user', 'name email');
    const report = members.map(m => ({
      member: m.user.name,
      email: m.user.email,
      attendanceCount: m.attendance.length
    }));
    res.json(report);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
