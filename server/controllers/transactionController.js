import Transaction from '../models/Transaction.js';
import Farm from '../models/Farm.js';  
import mongoose from 'mongoose';

const transactionController = {
async getTransactions(req, res) {
    try {
      const userId = req.user.id; // Assuming user ID is extracted from JWT
  
      const transactions = await Transaction.find({
        $or: [{ from: userId }, { to: userId }] // Include investments and repayments
      })
        .populate("from", "firstName lastName email") 
        .populate("to", "firstName lastName email") 
        .populate("farmId", "name location") // Populate farm details
        .populate("loan", "amount interestRate duration status") // Populate loan details
        .sort({ createdAt: -1 }); // Sort by newest transactions first
  
      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  async getAnalytics(req, res) {
    try {
      const userId = new mongoose.Types.ObjectId(req.user.id);
  
      // Fetch investment data
      const investments = await Transaction.aggregate([
        { $match: { from: userId, type: 'investment' } },
        { $group: { _id: { $month: "$createdAt" }, totalAmount: { $sum: "$amount" } } },
        { $sort: { _id: 1 } }
      ]);
  
      // Fetch repayment data (Now checks both `from` and `to`)
      const repayments = await Transaction.aggregate([
        { 
          $match: { 
            $or: [{ from: userId }, { to: userId }], 
            type: 'repayment' 
          } 
        },
        { $group: { _id: { $month: "$createdAt" }, totalAmount: { $sum: "$amount" } } },
        { $sort: { _id: 1 } }
      ]);
  
      // Log the data for debugging
      console.log("Investments:", investments);
      console.log("Repayments:", repayments);
  
      res.json({ investments, repayments });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  

  async getTransactionDetails(req, res) {
    try {
      console.log("Transaction ID:", req.params.id);
  
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid Transaction ID" });
      }
  
      const transaction = await Transaction.findById(req.params.id)
        .populate("from", "firstName lastName email") // Fetch sender details
        .populate("to", "firstName lastName email")   // Fetch receiver details
        .populate({
          path: "loan",
          select: "amount interestRate duration status amountPaid repaymentSchedule"
        })
        .populate("farmId", "name location");
  
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
  
      console.log("Fetched transaction details:", transaction); // Debugging
      res.json(transaction);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      res.status(500).json({ message: "Server error" });
    }
  },


  async getAllTransactions(req, res) {
    try {
      const transactions = await Transaction.find()
        .populate("from", "firstName lastName email role") // Investor
        .populate("to", "firstName lastName email role") // Farmer
        .populate("farmId", "name location") // Farm details
        .populate("loan", "amount interestRate duration status") // Loan details
        .sort({ createdAt: -1 }); // Sort by newest first
  
      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching all transactions:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
  
  
  

};

export default transactionController;
