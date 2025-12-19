# 🎵 Full Stack Music Web Application

A complete full-stack music streaming web application built with Node.js, Express, MongoDB, and vanilla JavaScript. Features user authentication, song management, favorites, search functionality, and an admin panel for content management.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Usage Guide](#usage-guide)
- [Creating Admin User](#creating-admin-user)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### User Features
- **User Authentication**: Register and login with JWT-based authentication
- **Browse Songs**: View all available songs on the home page
- **Music Player**: HTML5 audio player with play/pause, previous, and next controls
- **Search**: Search songs by title or artist name
- **Favorites**: Add/remove songs to favorites (requires login)
- **User Profile**: View profile information including total favorites

### Admin Features
- **Admin Dashboard**: Separate admin panel for content management
- **Upload Songs**: Upload MP3 audio files with optional cover images
- **Manage Songs**: Update song details (title, artist, genre, cover image)
- **Delete Songs**: Remove songs from the platform
- **View All Songs**: See all uploaded songs with details

## 🛠 Tech Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Multer**: File upload handling

### Frontend
- **HTML5**: Markup
- **CSS3**: Styling with responsive design
- **Vanilla JavaScript**: No frameworks, pure JS
- **HTML5 Audio API**: Music player

## 📁 Project Structure

```
music-web-app/
├── backend/
│   ├── controllers/
│   │   ├── adminController.js    # Admin operations
│   │   ├── authController.js     # Authentication
│   │   ├── favoriteController.js # Favorites management
│   │   ├── profileController.js  # User profile
│   │   └── songController.js     # Song operations
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT authentication
│   │   └── uploadMiddleware.js   # File upload handling
│   ├── models/
│   │   ├── Song.js               # Song model
│   │   └── User.js               # User model
│   └── routes/
│       ├── adminRoutes.js        # Admin routes
│       ├── authRoutes.js         # Auth routes
│       ├── favoriteRoutes.js     # Favorite routes
│       ├── profileRoutes.js      # Profile routes
│       └── songRoutes.js         # Song routes
├── frontend/
│   ├── css/
│   │   ├── auth.css              # Login/Register styles
│   │   ├── common.css            # Shared styles
│   │   ├── favorites.css         # Favorites page styles
│   │   ├── home.css              # Home page styles
│   │   ├── profile.css           # Profile page styles
│   │   └── search.css            # Search page styles
│   ├── js/
│   │   ├── favorites.js          # Favorites page logic
│   │   ├── home.js               # Home page logic
│   │   ├── login.js              # Login logic
│   │   ├── navbar.js             # Navigation bar
│   │   ├── profile.js            # Profile page logic
│   │   ├── register.js           # Registration logic
│   │   ├── search.js             # Search page logic
│   │   └── utils.js              # Utility functions
│   ├── index.html                # Home page
│   ├── search.html               # Search page
│   ├── favorites.html            # Favorites page
│   ├── profile.html              # Profile page
│   ├── login.html                # Login page
│   └── register.html             # Register page
├── admin/
│   ├── css/
│   │   └── admin.css             # Admin panel styles
│   ├── js/
│   │   ├── admin.js              # Admin dashboard logic
│   │   └── admin-utils.js        # Admin utilities
│   ├── index.html                # Admin dashboard
│   └── login.html                 # Admin login
├── uploads/
│   ├── audio/                    # Audio files storage
│   └── images/                   # Cover images storage
├── .env.example                  # Environment variables example
├── .gitignore                    # Git ignore file
├── package.json                  # Dependencies
├── server.js                     # Main server file
└── README.md                     # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn**

## 🚀 Installation

### Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd music-web-app

# Or extract the downloaded project folder
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- multer
- cors
- dotenv

### Step 3: Set Up MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# MongoDB should start automatically as a service
# Or start manually:
mongod
```

**macOS/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod
# Or
mongod
```

### Step 4: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file and set your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/musicapp
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3000
```

**Important**: Change `JWT_SECRET` to a strong random string in production!

## ⚙️ Configuration

### MongoDB Connection

The default connection string is:
```
mongodb://localhost:27017/musicapp
```

If your MongoDB is running on a different port or you're using MongoDB Atlas, update the `MONGODB_URI` in `.env`.

### Port Configuration

The server runs on port `3000` by default. Change it in `.env` if needed.

## 🎮 Running the Application

### Step 1: Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

### Step 2: Access the Application

- **Frontend**: Open `http://localhost:3000` in your browser
- **Admin Panel**: Open `http://localhost:3000/admin/index.html`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Songs (Public)
- `GET /api/songs` - Get all songs
- `GET /api/songs/search?query=...` - Search songs
- `GET /api/songs/:id` - Get song by ID

### Favorites (Protected)
- `GET /api/favorites` - Get user's favorites
- `GET /api/favorites/check/:songId` - Check if song is favorite
- `POST /api/favorites/:songId` - Add to favorites
- `DELETE /api/favorites/:songId` - Remove from favorites

### Profile (Protected)
- `GET /api/profile` - Get user profile

### Admin (Protected, Admin Only)
- `GET /api/admin/songs` - Get all songs (admin view)
- `POST /api/admin/songs/upload` - Upload new song
- `PUT /api/admin/songs/:id` - Update song
- `DELETE /api/admin/songs/:id` - Delete song

## 📖 Usage Guide

### For Regular Users

1. **Register/Login**
   - Click "Register" to create an account
   - Or "Login" if you already have an account

2. **Browse Songs**
   - Home page shows all available songs
   - Click "Play" to start playing a song
   - Use the music player controls (play/pause, previous, next)

3. **Search Songs**
   - Go to "Search" page
   - Enter song title or artist name
   - Click "Search" or press Enter

4. **Add Favorites**
   - Click the heart icon (♡) on any song
   - View favorites on "Favorites" page
   - Remove favorites by clicking "Remove" button

5. **View Profile**
   - Go to "Profile" page
   - See your account details and total favorites

### For Admins

1. **Admin Login**
   - Go to `/admin/login.html`
   - Login with admin credentials

2. **Upload Songs**
   - Fill in song details (title, artist, genre)
   - Select audio file (MP3, WAV, OGG)
   - Optionally upload cover image
   - Click "Upload Song"

3. **Manage Songs**
   - View all songs in the dashboard
   - Click "Edit" to update song details
   - Click "Delete" to remove a song

## 👤 Creating Admin User

By default, new users are created with `role: 'user'`. To create an admin user:

### Option 1: Using MongoDB Shell

```bash
# Connect to MongoDB
mongo

# Use the database
use musicapp

# Create admin user (password will be hashed automatically)
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$YourHashedPasswordHere",
  role: "admin"
})
```

**Note**: You need to hash the password first. Use bcrypt or create a user through registration and then update the role.

### Option 2: Using Node.js Script

Create a file `create-admin.js`:

```javascript
const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/musicapp')
  .then(async () => {
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // Will be hashed automatically
      role: 'admin'
    });
    console.log('Admin created:', admin);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
```

Run it:
```bash
node create-admin.js
```

### Option 3: Register and Update Role

1. Register a new user through the frontend
2. Use MongoDB shell or Compass to update the user's role:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Middleware protects sensitive endpoints
- **Admin Authorization**: Only admins can access admin routes
- **File Validation**: Only allowed file types can be uploaded

## 🐛 Troubleshooting

### MongoDB Connection Error

**Problem**: `MongoDB connection error`

**Solutions**:
1. Ensure MongoDB is running: `mongod` or check service status
2. Check connection string in `.env`
3. Verify MongoDB port (default: 27017)

### Port Already in Use

**Problem**: `Port 3000 is already in use`

**Solutions**:
1. Change PORT in `.env` file
2. Or stop the process using port 3000

### File Upload Errors

**Problem**: `Error uploading file`

**Solutions**:
1. Check file size (max 10MB for audio, 5MB for images)
2. Verify file type (MP3/WAV/OGG for audio, JPEG/PNG/GIF/WebP for images)
3. Ensure `uploads/audio` and `uploads/images` directories exist

### Authentication Errors

**Problem**: `Invalid token` or `Access denied`

**Solutions**:
1. Clear browser localStorage
2. Login again
3. Check JWT_SECRET in `.env`

### CORS Errors

**Problem**: CORS policy errors in browser console

**Solutions**:
1. Ensure frontend is served from the same origin
2. Check CORS configuration in `server.js`

## 📝 Notes

- **File Storage**: Uploaded files are stored locally in `uploads/` directory
- **Default Cover**: Songs without cover images use a default placeholder
- **Token Expiry**: JWT tokens expire after 7 days
- **Password Requirements**: Minimum 6 characters

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables**: Set secure values in `.env`
2. **MongoDB**: Use MongoDB Atlas or secure MongoDB instance
3. **File Storage**: Consider using cloud storage (AWS S3, Cloudinary)
4. **HTTPS**: Use HTTPS for secure connections
5. **Error Handling**: Add comprehensive error logging
6. **Rate Limiting**: Implement rate limiting for API endpoints
7. **Security Headers**: Add security headers (helmet.js)

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork, modify, and use this project for learning or as a base for your own applications.

## 📧 Support

For issues or questions, please check the troubleshooting section or create an issue in the repository.

---

**Happy Coding! 🎵**

