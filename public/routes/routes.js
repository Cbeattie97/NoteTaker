const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '../../db/db.json');

// GET all notes
router.get('/notes', (req, res) => {
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading notes' });
    }
    res.json(JSON.parse(data));
  });
});

// POST a new note
router.post('/notes', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ message: 'Note title and text are required' });
  }

  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading notes' });
    }

    const notes = JSON.parse(data);
    const newNote = {
      id: Date.now(),
      title,
      text
    };

    notes.push(newNote);

    fs.writeFile(dbFilePath, JSON.stringify(notes, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving note' });
      }
      res.json(newNote);
    });
  });
});

// DELETE a note
router.delete('/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);

  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading notes' });
    }

    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);

    fs.writeFile(dbFilePath, JSON.stringify(notes, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting note' });
      }
      res.json({ message: 'Note deleted' });
    });
  });
});

module.exports = router;
