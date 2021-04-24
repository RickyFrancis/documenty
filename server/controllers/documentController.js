const asyncHandler = require('express-async-handler');
const Document = require('../models/Document');

// @desc Get all documents
// @route GET /api/documents
// @access Private/Admin
const getDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({});
  res.json(documents);
});

// @desc Delete a document
// @route DELETE /api/documents/:id
// @access Private/Admin
const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (document) {
    await document.remove();
    const documents = await Document.find({});
    res.json(documents);
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

module.exports = { getDocuments, deleteDocument };
