const express = require("express");
const app = express();

app.use(express.json());

const notes = require("./data/notes-data");

/*
Modify the /notes/:noteId handler to return an error if the :noteId does not exist
*/
app.get("/notes/:noteId", (req, res, next) => {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);

  if(foundNote){
    res.json({ data: foundNote });
  } else {
    //next(`Note id not found: ${req.params.noteId}`);
    res.status(400).json({error: `Note id not found: ${req.params.noteId}`});
  }
});

app.get("/notes", (req, res) => {
  res.json({ data: notes });
});

// TODO: Add ability to create a new note
/*
Create a new /notes/ route that will handle a POST request containing the notes data (i.e., {"data": {"text": "<note-text-here>"}}) to the /notes endpoint, which will in turn:
Assign a new ID to the note
Store the note
Return a 201 status code and the stored note as JSON on success
Return a 400 status code if the text property is missing or empty in the incoming request body
*/
let lastNoteId = notes.reduce((maxId, note) => Math.max(maxId, note.id), 0);
app.post("/notes", (req, res, next) => {
  const { data: {text} = {} } = req.body;
  if(text){
    const newNote = {
      id: ++lastNoteId,
      text
    };
    notes.push(newNote);
    res.status(201).json({data: newNote});
  }else{
    res.sendStatus(400);
  }
});

// TODO: Add not-found handler
app.use((req, res, next) => {
  res.status(404).json({error: `Not found: ${req.originalUrl}`});
  // res.send(`Not found: ${req.originalUrl}`);
});

// TODO: Add error handler
app.use(((err, req, res, next) => {
  console.error(err);
  res.send(err);
}))

module.exports = app;
