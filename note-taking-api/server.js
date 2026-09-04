const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running smoothly!');
});


const filePath = path.join(__dirname, 'notes.json');

// Helper function to read notes from file
function readNotes() {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data || '[]');
}

// Helper function to write notes to file
function saveNotes(notes) {
  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
}

// 1. GET /notes - Read all notes
app.get('/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

// 2. POST /notes - Create a new note
app.post('/notes', (req, res) => {
  const notes = readNotes();
  const newNote = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content
  };
  notes.push(newNote);
  saveNotes(notes);
  res.status(201).json(newNote);
});

// 3. PUT /notes/:id - Update a note
app.put('/notes/:id', (req, res) => {
  const notes = readNotes();
  const noteId = parseInt(req.params.id);
  const noteIndex = notes.findIndex(n => n.id === noteId);

  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }

  notes[noteIndex].title = req.body.title || notes[noteIndex].title;
  notes[noteIndex].content = req.body.content || notes[noteIndex].content;

  saveNotes(notes);
  res.status(200).json(notes[noteIndex]);
});

// 4. DELETE /notes/:id - Delete a note
app.delete('/notes/:id', (req, res) => {
  let notes = readNotes();
  const noteId = parseInt(req.params.id);
  notes = notes.filter(n => n.id !== noteId);

  saveNotes(notes);
  res.status(200).json({ message: 'Note deleted successfully' });
});

// Start the server
// Use the cloud provider's port, or default to 3000 for local testing
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
