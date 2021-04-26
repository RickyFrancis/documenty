const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
  getDocuments,
  deleteDocument,
  addNewEditor,
  removeEditor,
} = require('../controllers/documentController');
// import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, getDocuments);
router.route('/:id').delete(protect, deleteDocument);
router
  .route('/:id/editors')
  .post(protect, addNewEditor)
  .delete(protect, removeEditor);

module.exports = router;
