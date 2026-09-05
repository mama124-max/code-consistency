const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');

// Override DNS resolution for MongoDB Atlas SRV connection
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection String
const MONGO_URI = 'mongodb+srv://mamaceesy344_db_user:OUMGM13kLHQyDpT5@cluster0.s8kd6dd.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Note Schema & Model
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);

// Root Route
app.get('/', (req, res) => {
  res.send('API is running smoothly!');
});

// GET all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST a new note
app.post('/notes', async (req, res) => {
  try {
    const newNote = new Note({
      title: req.body.title,
      content: req.body.content
    });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create note' });
  }
});

// PUT (Update) a note by ID
app.put('/notes/:id', async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content },
      { new: true }
    );
    if (!updatedNote) return res.status(404).json({ error: 'Note not found' });
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update note' });
  }
});

// DELETE a note by ID
app.delete('/notes/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});