import express from "express";

import {
  createUserActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  getActivityByUserId
} from '../controllers/UserActivityController.js';

const router=express.Router();

router.post('/',createUserActivity);
router.get('/',getAllActivities);
router.get('/:id',getActivityById);
router.put(':id',updateActivity);
router.delete('/:id',deleteActivity);
router.get('/getByUser/:userId',getActivityByUserId);

export default router;