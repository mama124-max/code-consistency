const express = require('express');
const cors = require('cors'); // 1. Require cors

const app = express();

app.use(cors()); // 2. Enable cors BEFORE your routes!
app.use(express.json());

// In-memory array to store our notes
let notes = [
  { id: 1, title: 'First Note', content: 'Learning Express step by step!' }
];

// 1. GET /notes - Retrieve all notes (READ)
app.get('/notes', (req, res) => {
  res.status(200).json(notes);
});

// 2. POST /notes - Create a new note (CREATE)
app.post('/notes', (req, res) => {
  const newNote = {
    id: notes.length + 1,
    title: req.body.title,
    content: req.body.content
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

// 3. PUT /notes/:id - Update a note (UPDATE)
app.put('/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  const note = notes.find(n => n.id === noteId);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  note.title = req.body.title || note.title;
  note.content = req.body.content || note.content;

  res.status(200).json(note);
});

// 4. DELETE /notes/:id - Delete a note (DELETE)
app.delete('/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  notes = notes.filter(n => n.id !== noteId);

  res.status(200).json({ message: 'Note deleted successfully' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});