import express from 'express';
import { createUser, getAllUsers, getUserById, deleteUser, login } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createUser);     
router.post('/login', login);

// Protected routes
router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.delete('/:id', authMiddleware, deleteUser);

export default router;
