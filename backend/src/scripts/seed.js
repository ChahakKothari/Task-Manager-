require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
const connectDB = require('../config/db');

const seed = async () => {
  try {
    await connectDB();

    const adminName = process.env.SEED_ADMIN_NAME;
    const adminEmail = process.env.SEED_ADMIN_EMAIL;
    const adminPasswordPlain = process.env.SEED_ADMIN_PASSWORD;

    if (!adminName || !adminEmail || !adminPasswordPlain) {
      throw new Error('Missing seed env values. Set SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, and SEED_ADMIN_PASSWORD in backend/.env');
    }

    // clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});

    const adminPassword = await bcrypt.hash(adminPasswordPlain, 10);

    const admin = await User.create({ name: adminName, email: adminEmail, password: adminPassword, role: 'admin' });

    const tasks = [
      {
        title: 'Admin Dashboard Setup',
        description: 'Review the admin-only setup and confirm the seeded account can log in successfully.',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        userId: admin._id,
      },
    ];

    await Task.insertMany(tasks);

    console.log('Seed complete: created one admin with sample task(s).');
    process.exit(0);
  } catch (error) {
    console.error('Seed error', error);
    process.exit(1);
  }
};

seed();
