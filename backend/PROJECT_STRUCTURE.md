# Project Structure Documentation

## Complete File Structure

```
music-web-app/
│
├── 📁 backend/                          # Backend server code
│   ├── 📁 controllers/                   # Request handlers
│   │   ├── adminController.js           # Admin operations (upload, update, delete songs)
│   │   ├── authController.js            # Authentication (login, register)
│   │   ├── favoriteController.js        # Favorites management
│   │   ├── profileController.js         # User profile operations
│   │   └── songController.js            # Song operations (get, search)
│   │
│   ├── 📁 middleware/                    # Custom middleware
│   │   ├── authMiddleware.js            # JWT authentication & admin check
│   │   └── uploadMiddleware.js           # File upload handling (Multer)
│   │
│   ├── 📁 models/                        # Database models
│   │   ├── Song.js                      # Song schema (title, artist, audioUrl, etc.)
│   │   └── User.js                      # User schema (name, email, password, role, favorites)
│   │
│   └── 📁 routes/                         # API routes
│       ├── adminRoutes.js               # Admin API endpoints
│       ├── authRoutes.js                # Authentication endpoints
│       ├── favoriteRoutes.js           # Favorites endpoints
│       ├── profileRoutes.js            # Profile endpoints
│       └── songRoutes.js               # Song endpoints
│
├── 📁 frontend/                          # Frontend user interface
│   ├── 📁 css/                           # Stylesheets
│   │   ├── auth.css                     # Login/Register page styles
│   │   ├── common.css                   # Shared styles (navbar, buttons, forms)
│   │   ├── favorites.css                # Favorites page styles
│   │   ├── home.css                     # Home page styles
│   │   ├── profile.css                  # Profile page styles
│   │   └── search.css                   # Search page styles
│   │
│   ├── 📁 js/                            # JavaScript files
│   │   ├── favorites.js                 # Favorites page logic
│   │   ├── home.js                      # Home page & music player logic
│   │   ├── login.js                     # Login form handler
│   │   ├── navbar.js                    # Navigation bar component
│   │   ├── profile.js                   # Profile page logic
│   │   ├── register.js                  # Registration form handler
│   │   ├── search.js                    # Search functionality
│   │   └── utils.js                     # Utility functions (API calls, auth helpers)
│   │
│   ├── index.html                        # Home page (all songs)
│   ├── search.html                      # Search page
│   ├── favorites.html                   # Favorites page
│   ├── profile.html                     # User profile page
│   ├── login.html                       # Login page
│   └── register.html                    # Registration page
│
├── 📁 admin/                             # Admin panel
│   ├── 📁 css/
│   │   └── admin.css                    # Admin panel styles
│   ├── 📁 js/
│   │   ├── admin.js                     # Admin dashboard logic
│   │   └── admin-utils.js               # Admin utility functions
│   ├── index.html                       # Admin dashboard
│   └── login.html                       # Admin login page
│
├── 📁 uploads/                           # File storage
│   ├── 📁 audio/                         # MP3/WAV/OGG audio files
│   └── 📁 images/                        # Cover images (JPEG/PNG/GIF/WebP)
│
├── .env                                  # Environment variables (not in git)
├── .env.example                          # Environment variables template
├── .gitignore                            # Git ignore rules
├── package.json                          # Dependencies & scripts
├── server.js                             # Main server entry point
├── create-admin.js                       # Script to create admin user
├── README.md                             # Main documentation
├── SETUP.md                              # Quick setup guide
└── PROJECT_STRUCTURE.md                  # This file
```

## Key Files Explained

### Backend Files

#### `server.js`
- Main entry point
- Sets up Express server
- Connects to MongoDB
- Configures middleware (CORS, JSON parsing, static files)
- Registers all routes
- Starts the server

#### Models
- **User.js**: User schema with authentication fields, role, and favorites array
- **Song.js**: Song schema with title, artist, audio URL, cover image, etc.

#### Controllers
- **authController.js**: Handles registration and login, generates JWT tokens
- **songController.js**: Fetches all songs, searches songs, gets song by ID
- **favoriteController.js**: Adds/removes favorites, gets user's favorites
- **profileController.js**: Gets user profile information
- **adminController.js**: Uploads, updates, and deletes songs (admin only)

#### Middleware
- **authMiddleware.js**: Verifies JWT tokens, checks admin role
- **uploadMiddleware.js**: Handles file uploads using Multer (audio & images)

#### Routes
- All routes are organized by feature
- Protected routes use `authenticate` middleware
- Admin routes use both `authenticate` and `isAdmin` middleware

### Frontend Files

#### HTML Pages
- **index.html**: Home page with all songs and music player
- **search.html**: Search interface
- **favorites.html**: User's favorite songs
- **profile.html**: User profile information
- **login.html**: User login form
- **register.html**: User registration form

#### JavaScript Files
- **utils.js**: API request helper, authentication utilities, token management
- **navbar.js**: Renders navigation bar dynamically based on auth status
- **home.js**: Loads songs, handles music player, manages favorites
- **search.js**: Performs search and displays results
- **favorites.js**: Loads and manages favorite songs
- **profile.js**: Displays user profile information
- **login.js**: Handles login form submission
- **register.js**: Handles registration form submission

#### CSS Files
- **common.css**: Shared styles (navbar, buttons, forms, cards, alerts)
- **home.css**: Home page specific styles (music player, song cards)
- **search.css**: Search page styles
- **favorites.css**: Favorites page styles
- **profile.css**: Profile page styles
- **auth.css**: Login/Register page styles

### Admin Panel Files

#### `admin/index.html`
- Admin dashboard
- Upload song form
- List of all songs with edit/delete options

#### `admin/js/admin.js`
- Loads all songs
- Handles song upload
- Manages edit/delete operations

#### `admin/js/admin-utils.js`
- Admin-specific API utilities
- Admin token management

## Data Flow

### User Registration/Login Flow
1. User submits form → Frontend (login.js/register.js)
2. API request → Backend (authController.js)
3. Database operation → MongoDB (User model)
4. JWT token generated → Returned to frontend
5. Token stored in localStorage → Used for authenticated requests

### Song Upload Flow (Admin)
1. Admin fills form → Frontend (admin.js)
2. FormData with files → Backend (adminController.js)
3. Files saved → uploads/audio & uploads/images
4. Song record created → MongoDB (Song model)
5. Response returned → Frontend updates UI

### Music Player Flow
1. User clicks play → Frontend (home.js)
2. Audio source set → HTML5 audio element
3. Playback controls → Native browser audio controls
4. Previous/Next → Array navigation in JavaScript

### Favorites Flow
1. User clicks favorite → Frontend (home.js)
2. API request → Backend (favoriteController.js)
3. User model updated → MongoDB (favorites array)
4. UI updated → Frontend reflects change

## API Request Flow

```
Frontend (utils.js)
    ↓
API Request (fetch)
    ↓
Backend Route (routes/*.js)
    ↓
Middleware (authMiddleware.js) [if protected]
    ↓
Controller (controllers/*.js)
    ↓
Model (models/*.js)
    ↓
MongoDB
    ↓
Response back to Frontend
```

## Security Layers

1. **Password Hashing**: bcryptjs (in User model pre-save hook)
2. **JWT Authentication**: Token-based auth (authMiddleware.js)
3. **Role-Based Access**: Admin check (isAdmin middleware)
4. **File Validation**: Multer file filters (uploadMiddleware.js)
5. **Input Validation**: Mongoose schema validation

## File Upload Process

1. **Frontend**: FormData with files
2. **Multer Middleware**: Validates file type & size
3. **Storage**: Files saved to uploads/audio or uploads/images
4. **Database**: File paths stored in Song model
5. **Serving**: Static files served via Express static middleware

## Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('user' | 'admin'),
  favorites: [ObjectId] (references Song),
  createdAt: Date,
  updatedAt: Date
}
```

### Song Collection
```javascript
{
  title: String,
  artist: String,
  audioUrl: String,
  coverImage: String,
  genre: String,
  duration: Number,
  uploadedBy: ObjectId (references User),
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 3000)

## Dependencies

### Backend
- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT tokens
- bcryptjs: Password hashing
- multer: File uploads
- cors: Cross-origin requests
- dotenv: Environment variables

### Development
- nodemon: Auto-reload during development

