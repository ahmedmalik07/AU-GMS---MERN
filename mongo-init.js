// MongoDB initialization script
db = db.getSiblingDB('fgms');

// Create collections
db.createCollection('users');
db.createCollection('members');

// Create indexes
db.members.createIndex({ "number": 1 }, { unique: true });
db.members.createIndex({ "attendance.date": 1 });
db.members.createIndex({ "isActive": 1 });
db.members.createIndex({ "joined": -1 });
db.members.createIndex({ "expiry": 1 });

db.users.createIndex({ "email": 1 }, { unique: true });

print('Database initialized successfully!');
