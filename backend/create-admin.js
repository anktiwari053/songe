/**
 * Script to create an admin user
 * Usage: node create-admin.js
 */

const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config();

// Get admin details from command line arguments or use defaults
const args = process.argv.slice(2);
const name = args[0] || 'Admin User';
const email = args[1] || 'admin@example.com';
const password = args[2] || 'admin123';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/musicapp';

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email, role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with this email');
      console.log('   To create a new admin, use a different email or delete the existing one');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password, // Will be hashed automatically by the model
      role: 'admin'
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('\n📋 Admin Details:');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${admin.role}`);
    console.log('\n⚠️  Please change the password after first login!');
    console.log('\n🔗 Login at: http://localhost:3000/admin/login.html\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

// Run the script
createAdmin();

