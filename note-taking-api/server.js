const express = require('express');
const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// In-memory array to store notes
let notes = [];

// Simple test route
app.get('/', (req, res) => {
  res.send('Note-Taking API is running!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});