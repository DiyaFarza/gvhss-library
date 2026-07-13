// Run with: npm run seed
// Creates the one fixed admin account (from .env) and the sample book you gave.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Book = require('../models/Book');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding...');

  const adminUsername = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';

  const existingAdmin = await User.findOne({ username: adminUsername });
  if (existingAdmin) {
    console.log(`Admin account "${adminUsername}" already exists. Skipping creation.`);
  } else {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await User.create({ username: adminUsername, password: hashed, role: 'admin' });
    console.log(`Admin account created: ${adminUsername} / ${adminPassword}`);
  }

  const existingBook = await Book.findOne({ bookNo: '1936' });
  if (existingBook) {
    console.log('Sample book 1936 already exists. Skipping creation.');
  } else {
    await Book.create({
      bookNo: '1936',
      name: 'Green Guardian',
      author: 'Sheril Rao',
      publisher: 'DC Books',
      price: 199,
      owner: {},
    });
    console.log('Sample book 1936 (Green Guardian) created.');
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});