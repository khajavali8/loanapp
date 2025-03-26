import express from 'express';
import userController from '../controllers/userController.js';
import { authenticateUser, isAdmin } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.get('/profile', authenticateUser, userController.getProfile);
router.put('/profile', authenticateUser, userController.updateProfile);
router.put('/change-password', authenticateUser, userController.changePassword);

router.get('/', authenticateUser, isAdmin, userController.getAllUsers);
router.put('/:id/verify', authenticateUser, isAdmin, userController.verifyUser);
router.get('/loans', authenticateUser, isAdmin, userController.getAllLoans);
router.get('/farms', authenticateUser, isAdmin, userController.getAllFarms);
router.delete('/:id', authenticateUser, isAdmin, userController.deleteUser);

router.get('/all-documents', authenticateUser, userController.getAllUserDocuments);
router.put('/documents/:id/verify', authenticateUser, isAdmin, userController.verifyDocument);

export default router;
