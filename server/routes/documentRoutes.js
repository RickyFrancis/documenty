const express = require('express');
const router = express.Router();

const {
  getDocuments,
  deleteDocument,
} = require('../controllers/documentController');
// import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getDocuments);
router.route('/:id').delete(deleteDocument);

module.exports = router;
