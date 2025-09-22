import express from 'express';
import { createUser, getAllUsers, getUserById, deleteUser, login , updateUser , updatePassword} from '../controllers/userController.js';
import { addToFavorites , removeFromFavorites , getUserDetailsById } from '../controllers/userDetailsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createUser);     
router.post('/login', login);

// Protected routes
router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.patch('/update',authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);
router.patch('/changePassword',updatePassword);
router.patch('/addToFavorites',authMiddleware, addToFavorites);
router.patch('/removeFromFavorites',authMiddleware,removeFromFavorites);
router.get('/userDetails/:userId',authMiddleware, getUserDetailsById);
export default router;
