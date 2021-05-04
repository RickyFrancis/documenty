const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
  getDocuments,
  getSingleDocuments,
  deleteDocument,
  addNewEditor,
  removeEditor,
  updateDocumentName,
} = require('../controllers/documentController');
// import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getDocuments);
router
  .route('/:id')
  .delete(protect, deleteDocument)
  .get(protect, getSingleDocuments);
router
  .route('/:id/editors')
  .post(protect, addNewEditor)
  .put(protect, removeEditor);
router.route('/:id/name').put(protect, updateDocumentName);

module.exports = router;
