const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resolutions-tracker';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


// Schemas
const ResolutionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: 'other' },
  status: { type: String, default: 'in-progress' },
  deadline: Date,
  tasks: [{
    id: String,
    text: String,
    completed: { type: Boolean, default: false }
  }],
  progress: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const DailyHabitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: 'other' },
  deadline: Date,
  completedToday: { type: Boolean, default: false },
  history: [String], // Array of date strings
  createdAt: { type: Date, default: Date.now }
});

// Models
const Resolution = mongoose.model('Resolution', ResolutionSchema);
const DailyHabit = mongoose.model('DailyHabit', DailyHabitSchema);

// ============ RESOLUTIONS API ============

// Get all resolutions
app.get('/api/resolutions', async (req, res) => {
  try {
    const resolutions = await Resolution.find().sort({ createdAt: -1 });
    res.json(resolutions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create resolution
app.post('/api/resolutions', async (req, res) => {
  try {
    const resolution = new Resolution(req.body);
    await resolution.save();
    res.status(201).json(resolution);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update resolution
app.put('/api/resolutions/:id', async (req, res) => {
  try {
    const resolution = await Resolution.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(resolution);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete resolution
app.delete('/api/resolutions/:id', async (req, res) => {
  try {
    await Resolution.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resolution deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ DAILY HABITS API ============

// Get all daily habits
app.get('/api/daily-habits', async (req, res) => {
  try {
    const habits = await DailyHabit.find().sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create daily habit
app.post('/api/daily-habits', async (req, res) => {
  try {
    const habit = new DailyHabit(req.body);
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update daily habit
app.put('/api/daily-habits/:id', async (req, res) => {
  try {
    const habit = await DailyHabit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(habit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete daily habit
app.delete('/api/daily-habits/:id', async (req, res) => {
  try {
    await DailyHabit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Daily habit deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Daily reset endpoint (call this from frontend at midnight)
app.post('/api/daily-habits/reset', async (req, res) => {
  try {
    await DailyHabit.updateMany({}, { completedToday: false });
    res.json({ message: 'All habits reset for new day' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
