// Member model for FGMS
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  number: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Must be 10 digits.`
    }
  },
  membership: {
    type: String,
    required: [true, 'Membership type is required'],
    enum: {
      values: ['Monthly', 'Quarterly', 'Yearly'],
      message: '{VALUE} is not a valid membership type. Must be Monthly, Quarterly, or Yearly'
    }
  },
  expiry: {
    type: Date,
    required: [true, 'Expiry date is required'],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  picture: {
    type: String,
    default: 'https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg?semt=ais_items_boosted&w=740'
  },
  joined: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  attendance: [{
    date: {
      type: Date,
      required: true
    },
    checkIn: {
      type: Date,
      required: true
    },
    checkOut: {
      type: Date
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
memberSchema.index({ number: 1 }, { unique: true });
memberSchema.index({ 'attendance.date': 1 });
memberSchema.index({ isActive: 1 });
memberSchema.index({ joined: -1 });
memberSchema.index({ expiry: 1 });

// Virtual for membership status
memberSchema.virtual('membershipStatus').get(function() {
  const now = new Date();
  if (!this.isActive) return 'inactive';
  if (now > this.expiry) return 'expired';
  return 'active';
});

// Method to check if membership is valid
memberSchema.methods.isMembershipValid = function() {
  const now = new Date();
  return this.isActive && now <= this.expiry;
};

// Method to mark attendance
memberSchema.methods.markAttendance = async function(checkIn = new Date()) {
  const today = new Date(checkIn);
  today.setHours(0, 0, 0, 0);

  const existingAttendance = this.attendance.find(a => {
    const attendanceDate = new Date(a.date);
    attendanceDate.setHours(0, 0, 0, 0);
    return attendanceDate.getTime() === today.getTime();
  });

  if (existingAttendance) {
    if (!existingAttendance.checkOut) {
      existingAttendance.checkOut = checkIn;
      console.log('Updated checkout time for existing attendance');
    } else {
      console.log('Attendance already marked for today');
    }
  } else {
    this.attendance.push({
      date: today,
      checkIn: checkIn
    });
    console.log('Added new attendance record');
  }

  // Save the document to MongoDB
  await this.save();
  console.log('Member attendance saved to database');
  return this;
};

// Method to get attendance for a specific date range
memberSchema.methods.getAttendanceByDateRange = function(startDate, endDate) {
  return this.attendance.filter(a => {
    const attendanceDate = new Date(a.date);
    return attendanceDate >= startDate && attendanceDate <= endDate;
  });
};

const Member = mongoose.model('Member', memberSchema);

// Create indexes
Member.createIndexes().catch(err => console.error('Error creating indexes:', err));

module.exports = Member;
