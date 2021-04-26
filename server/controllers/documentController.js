const asyncHandler = require('express-async-handler');
const Document = require('../models/Document');
const User = require('../models/User');

// @desc Get all documents
// @route GET /api/documents
// @access Private/Admin
const getDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({
    $or: [
      { owner: req.user.id },
      {
        editors: req.user.id,
      },
    ],
  });
  res.json(documents);
});

// @desc Delete a document
// @route DELETE /api/documents/:id
// @access Private/Admin
const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.id,
    owner: req.user.id,
  });
  if (document) {
    await document.remove();
    const documents = await Document.find({
      $or: [
        { owner: req.user.id },
        {
          editors: req.user.id,
        },
      ],
    });
    res.json(documents);
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

// @desc Add new editor
// @route POST /api/documents/:id/editors
// @access Private
const addNewEditor = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const editor = await User.findOne({
    email,
  });

  if (editor) {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (document) {
      const alreadyAdded = document.editors.find(
        (editorCheck) => editorCheck.toString() === editor._id.toString()
      );
      if (alreadyAdded) {
        res.status(400);
        throw new Error('Editor already added');
      }

      document.editors.push(editor._id);

      await document.save();

      res.status(201).json({ message: 'Editor added' });
    } else {
      res.status(404);
      throw new Error('Document not found');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Remove editor
// @route DELETE /api/documents/:id/editors
// @access Private
const removeEditor = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const editor = await User.findOne({
    email,
  });

  if (editor) {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (document) {
      const editorExists = document.editors.find(
        (editorCheck) => editorCheck.toString() === editor._id.toString()
      );
      if (!editorExists) {
        res.status(400);
        throw new Error('Editor does not exists');
      }

      document.editors.pop(editor._id);

      await document.save();

      res.status(200).json({ message: 'Editor removed' });
    } else {
      res.status(404);
      throw new Error('Document not found');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { getDocuments, deleteDocument, addNewEditor, removeEditor };
