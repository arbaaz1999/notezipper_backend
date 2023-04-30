const Note = require("../models/noteModels");
const asyncHandler = require("express-async-handler");


const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.userId });
  res.json({
    message: "Notes fetched successfully",
    data: notes,
    error: null,
  });
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
  try {
    // console.log(req.params); c
    const note = await Note.findOne({ _id: req.params.id });
    if (note) {
      res.json({
        message: "Successfully fetched",
        data: note,
        error: null,
      });
    } else {
      res.status(400).json({ message: "Note not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something went wrong",
      error: error,
    });
  }
});

const updateNotes = asyncHandler(async (req, res) => {
  try {
    const { id, title, content, category } = req.body;
    console.log(id);
    console.log("before finding a doc");
    const note = await Note.findOne({ _id: id.id }, (err, doc) => {
      if (err) return err;
      else return doc;
    })
      .clone()
      .catch((err) => err);
    console.log(note);
    if (note.user.toString() !== req.userId.toString()) {
      res.status(401).json({
        message: "Unathorized",
      });
    } else {
      note.title = title;
      note.content = content;
      note.category = category;
      const updatedNote = await note.save();
      return res.status(200).json({
        message: "Updated Successfully",
        data: updatedNote,
        error: null,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something went wrong",
      error,
    });
  }
});

const deleteNote = asyncHandler(async (req, res) => {
  try {
    console.log("request params is", req.params);
    const note = await Note.findOne({ _id: req.params.id }, (err, doc) => {
      if (err) return err;
      else return doc;
    })
      .clone()
      .catch((err) => {
        console.log(err);
      });

    console.log(note);

    if (note.user.toString() !== req.userId.toString()) {
      res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (note) {
      await note.remove();
      res.json({
        message: "Note Successfully Deleted",
      });
      console.log("note deleted");
    } else {
      res.status(400);
      throw new Error("Note not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Can not delete note!",
      error: error,
    });
  }
});

module.exports = { getNotes, createNote, getNoteById, updateNotes, deleteNote };
