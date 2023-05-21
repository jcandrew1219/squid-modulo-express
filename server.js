const express = require('express');
const path = require('path');
const savedNotes = require('./db/db.json');
const fs = require('fs');
const PORT = process.env.PORT || 3001;

var uniqid = require('uniqid');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//If I use this my page is forever stuck on index.html
//app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('/api/notes', (req, res) => {
  res.json(savedNotes);
})

app.post('/api/notes', (req, res) => {
  const {title, text} = req.body;

  if (title && text) {
    const newNote = {
        title,
        text,
        id: uniqid(),
    };

    savedNotes.push(newNote);

    fs.writeFile(
      './db/db.json',
      JSON.stringify(savedNotes, null, 4),
      (writeErr) =>
          writeErr
          ? console.error(writeErr)
          : console.info('Successfully updated reviews!')
    );
    res.json(newNote);
  } else {
    res.json('Error must include title and text');
  }
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });