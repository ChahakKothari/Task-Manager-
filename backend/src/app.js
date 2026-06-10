const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const inviteRoutes = require('./routes/inviteRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Image must be 5 MB or smaller' });
    }

    if (typeof err.message === 'string' && err.message.includes('Only JPG, JPEG, PNG, and WEBP files are allowed')) {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message || 'Internal server error' });
  }

  next();
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
