import express from 'express';
import { createUser } from '../controllers/userController.js';
import { getAllUsers,getUserById } from '../controllers/userController.js';
import { deleteUser,login } from '../controllers/userController.js';
const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id',getUserById);
router.delete('/:id', deleteUser);
router.post('/login', login);
export default router;