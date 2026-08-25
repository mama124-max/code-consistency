const express = require('express');
const app = express();

// Middleware to parse JSON in incoming requests
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});