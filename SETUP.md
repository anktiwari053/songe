# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and set your values (optional, defaults work for local development)
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

**Windows:**
- MongoDB usually runs as a service automatically
- Or run: `mongod`

**macOS/Linux:**
```bash
sudo systemctl start mongod
# Or
mongod
```

### 4. Create Admin User (Optional but Recommended)
```bash
# Using default values
node create-admin.js

# Or with custom values
node create-admin.js "Admin Name" "admin@example.com" "password123"
```

### 5. Start the Server
```bash
npm start
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login.html

## Default Admin Credentials (if created with script)
- Email: `admin@example.com`
- Password: `admin123`

**⚠️ Change the password after first login!**

## First Steps

1. **Register a regular user** at http://localhost:3000/register.html
2. **Login as admin** at http://localhost:3000/admin/login.html
3. **Upload some songs** from the admin dashboard
4. **Start listening** on the home page!

## Troubleshooting

### MongoDB Not Running
- Error: `MongoDB connection error`
- Solution: Start MongoDB service

### Port Already in Use
- Error: `Port 3000 is already in use`
- Solution: Change PORT in `.env` file

### Cannot Upload Files
- Check that `uploads/audio` and `uploads/images` directories exist
- Verify file size (max 10MB for audio, 5MB for images)
- Check file type (MP3/WAV/OGG for audio)

For more details, see [README.md](README.md)

