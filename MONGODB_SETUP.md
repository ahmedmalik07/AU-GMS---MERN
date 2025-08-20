# MongoDB Setup Guide for FGMS

This guide will help you set up MongoDB for the FGMS project. Choose one of the following options:

## Option 1: Local MongoDB Installation (Recommended for Development)

### Windows:

1. **Download MongoDB Community Server:**

   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select "Windows" and download the MSI installer

2. **Install MongoDB:**

   - Run the downloaded MSI file
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (optional GUI tool)

3. **Verify Installation:**

   ```bash
   # Open Command Prompt and run:
   mongod --version
   ```

4. **Start MongoDB Service:**
   ```bash
   # MongoDB should start automatically as a service
   # If not, start it manually:
   net start MongoDB
   ```

### macOS:

1. **Using Homebrew (recommended):**

   ```bash
   # Install MongoDB
   brew tap mongodb/brew
   brew install mongodb-community

   # Start MongoDB
   brew services start mongodb-community
   ```

### Linux (Ubuntu/Debian):

1. **Install MongoDB:**

   ```bash
   # Import MongoDB public GPG key
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

   # Add MongoDB repository
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

   # Update packages and install
   sudo apt-get update
   sudo apt-get install -y mongodb-org

   # Start MongoDB
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

## Option 2: Docker MongoDB (Easy Setup)

1. **Install Docker Desktop:**

   - Download from [Docker Desktop](https://www.docker.com/products/docker-desktop)

2. **Run MongoDB with Docker:**

   ```bash
   # Navigate to your project directory
   cd c:\Users\ahmed\Desktop\AI\gym\Newrola

   # Start MongoDB with Docker Compose
   docker-compose up -d mongodb
   ```

3. **Verify MongoDB is running:**
   ```bash
   docker ps
   ```

## Option 3: MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account:**

   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Sign up for a free account

2. **Create a Cluster:**

   - Choose "Build a cluster"
   - Select "Shared" (free tier)
   - Choose your preferred cloud provider and region
   - Click "Create Cluster"

3. **Setup Database Access:**

   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Set privileges to "Read and write to any database"

4. **Setup Network Access:**

   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Add your current IP or use "0.0.0.0/0" for anywhere (less secure)

5. **Get Connection String:**

   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update Your .env File:**
   ```env
   # Replace the MONGO_URI in your .env file
   MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/fgms?retryWrites=true&w=majority
   ```

## Testing Your MongoDB Connection

1. **Start your backend server:**

   ```bash
   cd backend
   npm start
   ```

2. **Look for this message:**

   ```
   ✅ MongoDB Connected Successfully: localhost:27017
   📁 Database Name: fgms
   🔗 Connection State: 1
   ```

3. **Seed your database with test data:**
   ```bash
   npm run db:seed
   ```

## Troubleshooting

### Common Issues:

1. **"Connection refused" error:**

   - Make sure MongoDB service is running
   - Check if port 27017 is available
   - Verify your connection string

2. **"Authentication failed" error:**

   - Check your username and password
   - Ensure the user has proper permissions

3. **"Network timeout" error:**
   - Check your internet connection (for Atlas)
   - Verify network access settings (for Atlas)
   - Check firewall settings

### MongoDB GUI Tools:

1. **MongoDB Compass** (Official GUI)

   - Download from [MongoDB Compass](https://www.mongodb.com/products/compass)
   - Connect using: `mongodb://localhost:27017`

2. **Studio 3T** (Third-party)
   - More advanced features
   - Free version available

## Next Steps

Once MongoDB is set up and running:

1. **Start the backend server:**

   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend:**

   ```bash
   cd fgms
   npm run dev
   ```

3. **Access the application:**

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

4. **Login with seeded data:**
   - Email: admin@fgms.com
   - Password: admin123

Your FGMS application should now be fully functional with persistent data storage!
