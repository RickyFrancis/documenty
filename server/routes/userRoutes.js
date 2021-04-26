const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware.js');
// import {
//   //   authUser,
//   registerUser,
//   //   getUserProfile,
//   //   updateUserProfile,
//   //   getUsers,
//   //   deleteUser,
//   //   getUserById,
//   //   updateUser,
// } from '../controllers/userController.js';
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');

router.route('/').post(registerUser);
router.post('/login', authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// router.route('/').post(registerUser).get(protect, admin, getUsers);
// router.post('/login', authUser);
// router
//   .route('/profile')
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile);
// router
//   .route('/:id')
//   .delete(protect, admin, deleteUser)
//   .get(protect, admin, getUserById)
//   .put(protect, admin, updateUser);

module.exports = router;
