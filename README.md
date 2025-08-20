<<<<<<< HEAD
# Air University Central Gym Management System (FGMS)

A comprehensive gym management system built with React.js frontend and Node.js/Express backend with MongoDB database.

## 🚀 Features

- **Member Management**: Add, update, delete, and search gym members
- **Attendance Tracking**: Mark and track member attendance with date records
- **Membership Plans**: Manage different membership types (Monthly, Quarterly, Yearly)
- **Dashboard Analytics**: View member statistics, expiring memberships, and attendance data
- **User Authentication**: Secure login/registration system
- **Responsive Design**: Works on desktop and mobile devices
- **Image Upload**: Cloudinary integration for member profile pictures

## 🛠️ Tech Stack

### Frontend

- **React.js** - UI framework
- **React Router** - Navigation
- **Material-UI** - Component library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Date-fns** - Date utilities

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin requests

## 📁 Project Structure

```
FGMS/
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   │   ├── User.js
│   │   └── Member.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── members.js
│   │   ├── attendance.js
│   │   └── reports.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.js
│   ├── index.js           # Entry point
│   ├── package.json
│   └── .env               # Environment variables
├── fgms/                  # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── utils/        # Utility functions
│   │   └── App.jsx       # Main app component
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend directory:

   ```env
   # MongoDB Configuration
   MONGO_URI=mongodb://localhost:27017/fgms

   # Server Configuration
   PORT=4000

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Environment
   NODE_ENV=development

   # CORS Origins (comma separated)
   CORS_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

5. **Start the backend server:**
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:4000`

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd fgms
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Members

- `GET /api/members` - Get all members
- `POST /api/members` - Add new member
- `GET /api/members/:id` - Get member by ID
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Attendance

- `POST /api/attendance/:id/attendance` - Mark member attendance
- `GET /api/attendance/:id` - Get member attendance history

## 💾 Database Models

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed)
}
```

### Member Model

```javascript
{
  name: String (required),
  number: String (required, unique, 10 digits),
  membership: String (enum: Monthly/Quarterly/Yearly),
  expiry: Date (required),
  picture: String (URL),
  joined: Date (default: now),
  isActive: Boolean (default: true),
  attendance: [{
    date: Date,
    checkIn: Date,
    checkOut: Date
  }]
}
```

## 🎯 Key Features Implementation

### Member Management

- Full CRUD operations for gym members
- Phone number validation and uniqueness
- Membership type validation
- Profile picture upload via Cloudinary

### Attendance System

- Daily attendance marking
- Automatic duplicate prevention
- Attendance history tracking
- Member status updates based on attendance

### Dashboard Analytics

- Total members count
- Monthly new registrations
- Membership expiry tracking (3 days, 4-7 days warnings)
- Inactive member identification

### Authentication & Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes middleware
- CORS configuration

## 🔧 Configuration

### Environment Variables

**Backend (.env):**

```env
MONGO_URI=mongodb://localhost:27017/fgms
PORT=4000
JWT_SECRET=your-secret-key
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Database Connection

The system automatically connects to MongoDB and handles:

- Connection retries on failure
- Graceful disconnection on app termination
- Connection state monitoring

## 🚀 Production Deployment

### Backend Deployment

1. Set production environment variables
2. Use a production MongoDB instance
3. Configure proper CORS origins
4. Use PM2 or similar for process management

### Frontend Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Serve static files with nginx or similar
3. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - _Initial work_ - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Air University for the project requirements
- React and Node.js communities for excellent documentation
- Material-UI and Tailwind CSS for UI components

---

## 🐛 Known Issues

- [ ] Bulk attendance marking feature
- [ ] Advanced reporting features
- [ ] Email notifications for expiring memberships

## 🔜 Future Enhancements

- [ ] Payment tracking system
- [ ] Trainer management
- [ ] Equipment tracking
- [ ] Mobile app
- [ ] Advanced analytics and reports
- [ ] Integration with fitness trackers

---

**Note**: Make sure to update the JWT secret and other sensitive information before deploying to production.
