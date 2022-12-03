const Note = require("../models/noteModels");
const asyncHandler = require("express-async-handler");

const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.userId });
  res.json(notes);
});

const createNote = asyncHandler(async (req, res) => {
  console.log("create note req is ", req.userId);
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    res.status(400);
    throw new Error();
  } else {
    const note = new Note({
      user: req.userId,
      title: title,
      content: content,
      category: category,
    });

    const createNewNote = await note.save();

    res.status(200).json(createNewNote);
  }
});

const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    res.json(note);
  } else {
    res.status(400).json({ message: "Note not found" });
  }
});

const updateNotes = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  const note = await Note.findById(req.params.id);

  if (note.user.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot perform this action");
  }

  if (note) {
    note.title = title;
    note.category = category;
    note.content = content;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(400);
    throw new Error("Note not found");
  }
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note.user.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot perform this action");
  }

  if (note) {
    await note.remove();
    res.json("Note Removed");
  } else {
    res.status(400);
    throw new Error("Note not found");
  }
});

module.exports = { getNotes, createNote, getNoteById, updateNotes, deleteNote };
