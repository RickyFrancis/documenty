const asyncHandler = require('express-async-handler');
const Document = require('../models/Document');
const User = require('../models/User');

// @desc Get all documents
// @route GET /api/documents
// @access Private/Admin
const getDocuments = asyncHandler(async (req, res) => {
  const pageSize = 5;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
        $or: [
          { owner: req.user.id },
          {
            editors: req.user.id,
          },
        ],
      }
    : {
        $or: [
          { owner: req.user.id },
          {
            editors: req.user.id,
          },
        ],
      };

  const count = await Document.countDocuments({
    ...keyword,
  });
  const documents = await Document.find({
    ...keyword,
  })
    .populate('editors', ['name', 'email'])
    .populate('owner', ['name', 'email'])
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ updatedAt: -1 });

  res.json({
    documents,
    page,
    pages: Math.ceil(count / pageSize),
    keyword: req.query.keyword,
  });
});

// @desc Get single document by ID
// @route GET /api/documents/:id
// @access Private/Admin
const getSingleDocuments = asyncHandler(async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.id,
    owner: req.user.id,
  })
    .populate('editors', ['name', 'email'])
    .populate('owner', ['name', 'email']);

  if (document) {
    res.json(document);
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
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
    })
      .populate('editors', ['name', 'email'])
      .populate('owner', ['name', 'email']);

    if (document) {
      if (document.owner.email.toString() === email) {
        res.status(400);
        throw new Error(
          'You are the owner of this document. You cannot add yourself as an editor.'
        );
      }

      const alreadyAdded = document.editors.find(
        (editorCheck) => editorCheck._id.toString() === editor._id.toString()
      );
      if (alreadyAdded) {
        res.status(400);
        throw new Error('Editor already added');
      }

      document.editors.push(editor._id);

      await document.save();

      const updatedDocument = await Document.findOne({
        _id: req.params.id,
        owner: req.user._id,
      })
        .populate('editors', ['name', 'email'])
        .populate('owner', ['name', 'email']);

      res.json(updatedDocument);
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
    })
      .populate('editors', ['name', 'email'])
      .populate('owner', ['name', 'email']);

    if (document) {
      const editorExists = document.editors.find(
        (editorCheck) => editorCheck._id.toString() === editor._id.toString()
      );
      if (!editorExists) {
        res.status(400);
        throw new Error('Editor does not exists');
      }

      document.editors.pop(editor._id);

      await document.save();

      res.json(document);
    } else {
      res.status(404);
      throw new Error('Document not found');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  getDocuments,
  deleteDocument,
  addNewEditor,
  removeEditor,
  getSingleDocuments,
};
