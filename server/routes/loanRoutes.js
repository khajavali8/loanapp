import express from 'express';
import loanController from '../controllers/loanController.js';
import { authenticateUser, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Farmer Routes
router.post('/create', authenticateUser, loanController.createLoan);
router.get('/my-loans', authenticateUser, loanController.getMyLoans);
router.post('/:id/repay', authenticateUser, loanController.repayLoan);
router.get('/:id/repayment-schedule', authenticateUser, loanController.getRepaymentSchedule);

// Investor Routes
router.get('/my-investments', authenticateUser, loanController.getMyInvestments);
router.get('/available-loans', authenticateUser, loanController.getAvailableLoans);
router.post('/:id/invest', authenticateUser, loanController.investInLoan);

// Admin Routes
router.get('/pending-investments', authenticateUser, isAdmin, loanController.getPendingInvestments);
router.post('/verify-investment', authenticateUser, isAdmin, loanController.verifyInvestment);
router.post('/credit-investment', authenticateUser, isAdmin, loanController.creditInvestment);

export default router;
