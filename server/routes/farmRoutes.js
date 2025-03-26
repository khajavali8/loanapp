import express from 'express';
import farmController, { upload } from '../controllers/farmController.js';
import { authenticateUser , verifyFarmer  } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser  , verifyFarmer , upload.array('images', 5), farmController.createFarm);
router.get('/my-farms', authenticateUser, farmController.getMyFarms);
router.put('/:id', authenticateUser, upload.array('images', 5), farmController.updateFarm);

router.get('/all-farms', farmController.getAllFarms);
router.delete('/:id', authenticateUser, farmController.deleteFarm);

export default router;
