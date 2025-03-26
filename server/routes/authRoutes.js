import express from 'express';
import authController , { upload }from '../controllers/authController.js';

const router = express.Router();

router.post('/register',upload.single("profilePic"), authController.register);
router.post('/login', authController.login);

export default router;
