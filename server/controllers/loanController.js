import Loan from "../models/Loan.js";
import Transaction from "../models/Transaction.js";
import Farm from "../models/Farm.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/emailService.js";
import User from "../models/User.js";

function generateRepaymentSchedule(amount, interestRate, duration) {
  const monthlyInterest = interestRate / 12 / 100;
  const monthlyPayment =
    (amount * monthlyInterest * Math.pow(1 + monthlyInterest, duration)) /
    (Math.pow(1 + monthlyInterest, duration) - 1);

  const schedule = [];
  let remainingBalance = amount;

  for (let i = 1; i <= duration; i++) {
    const interest = remainingBalance * monthlyInterest;
    const principal = monthlyPayment - interest;
    remainingBalance -= principal;

    schedule.push({
      dueDate: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000),
      amount: monthlyPayment,
      status: "pending",
    });
  }

  return schedule;
}

const loanController = {
  /**
   * Create a new loan
   */
  async createLoan(req, res) {
    try {
      const { amount, interestRate, duration, farm } = req.body;

      const loan = await Loan.create({
        ...req.body,
        repaymentSchedule: generateRepaymentSchedule(amount, interestRate, duration),
      });

      const user = await User.findById(req.user.id).select('email firstName lastName');
      await sendEmail(
        user.email,
          "Farm IT - Loan Request Submitted",
            `<p><strong>Dear ${user.firstName},</strong></p>
          <p>Your loan request of <strong>${amount}</strong> has been successfully submitted.</p>
          <p>We will notify you once it is approved.</p>
          <p><strong>Best Regards,</strong><br>Farm IT Team</p>`
        );

      res.status(201).json(loan);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  /**
   * Repay a loan
   */
  async repayLoan(req, res) {
    try {
      const { amount } = req.body;
      const { id } = req.params; 
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Loan ID" });
      }
  
      const loan = await Loan.findById(id);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
  
      // Convert amount to number safely
      let newAmountPaid = parseFloat(amount);
      if (isNaN(newAmountPaid) || !isFinite(newAmountPaid)) {
        return res.status(400).json({ message: "Invalid repayment amount" });
      }
  
      // Calculate total amount including interest
      const totalAmount = loan.amount + (loan.amount * loan.interestRate) / 100;
  
      // Update amountPaid
      loan.amountPaid = parseFloat(loan.amountPaid) + newAmountPaid;
  
      // Update repayment schedule
      for (let payment of loan.repaymentSchedule) {
        if (payment.status === "pending" && newAmountPaid >= payment.amount) {
          payment.status = "paid";
          newAmountPaid -= payment.amount;
        }
      }
  
      // ✅ Check if the loan is fully repaid and update status
      const allPaid = loan.repaymentSchedule.every(payment => payment.status === "paid");
  
      if (loan.amountPaid >= totalAmount || allPaid) {
        loan.status = "completed";
      }
  
      await loan.save();
  
      // Record the repayment transaction
      const transaction = await Transaction.create({
        loan: loan._id,
        from: req.user.id,
        to: loan.investors.length > 0 ? loan.investors[0].investor : null,
        amount,
        type: "repayment",
        date: new Date(),
      });
      
      
  // Get user details for email
  const user = await User.findById(req.user.id).select("email firstName lastName");

  // Get next pending payment details
  const nextDuePayment = loan.repaymentSchedule.find(p => p.status === "pending");
  const nextDueDate = nextDuePayment ? new Date(nextDuePayment.dueDate).toLocaleDateString() : "N/A";
  const nextDueAmount = nextDuePayment ? nextDuePayment.amount : "N/A";

  // Send repayment confirmation email
  await sendEmail(
    user.email,
    "Farm IT - Loan Repayment Successful",
    `<p>Dear <b>${user.firstName} ${user.lastName}</b>,</p>
     <p>Your repayment of <b>${amount}</b> for the loan has been successfully processed.</p>
     <p>Your Transaction ID for this repayment is: <b>${transaction._id}</b></p>
     <p>Thank you for your timely payment!</p>
     <p>The next payment is due on <b>${nextDueDate}</b>, with an amount of <b>${nextDueAmount}</b>.</p>
     <p>Best regards,<br>Farm IT Team</p>`
  );

      res.status(200).json({ message: "Loan repaid successfully", loan, transaction });
    } catch (error) {
      console.error("Repay loan error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  /**
   * Get repayment schedule for a loan
   */
  async getRepaymentSchedule(req, res) {
    try {
      const loanId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(loanId)) {
        return res.status(400).json({ message: "Invalid Loan ID" });
      }

      const loan = await Loan.findById(loanId);
      if (!loan) {
        return res.status(404).json({ message: "Loan not found" });
      }
      res.json(loan.repaymentSchedule);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  
async getMyLoans(req, res) {
  try {
    // Find farms owned by the logged-in user
    const userFarms = await Farm.find({ farmer: req.user.id }).select('_id');
    
    // Extract farm IDs from the userFarms array
    const farmIds = userFarms.map(farm => farm._id);

    // Find loans that belong to the user's farms and populate the investors.investor field
    const loans = await Loan.find({ farm: { $in: farmIds } })
      .populate({
        path: 'investors.investor',
        select: 'name email', // Select the fields you want to populate
      });

    res.json(loans);
  } catch (error) {
    console.error("Error fetching my loans:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
},
  /**
   * Get all investments made by the logged-in user
   */
  async getMyInvestments(req, res) {
    try {
        const investments = await Transaction.find({ from: req.user.id, type: "investment" })
            .populate({
                path: "farmId",
                select: "name location description farmType", // Ensure name and location are selected
            })
            .populate({
                path: "loan",
                select: "amount interestRate duration status",
                populate: { path: "farm", select: "name location farmType" }, // Ensure farm details in loan are populated
            });

        if (!investments.length) {
            return res.status(404).json({ message: "No investments found" });
        }

        res.json(investments);
    } catch (error) {
        console.error("Error fetching investments:", error);
        res.status(500).json({ message: "Server error" });
    }
},

  /**
   * Get all available loans for investment
   */
  async getAvailableLoans(req, res) {
    try {
      const userId = req.user.id; // Get logged-in user ID
  
      // Fetch loans that are pending but exclude those where the user has already invested
      const loans = await Loan.find({
        status: "pending",
        "investors.investor": { $ne: userId }, // Exclude loans where user is an investor
      }).populate("farm", "name location");
  
      res.json(loans);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  /**
   * Invest in a loan
   */
  async investInLoan(req, res) {
    try {
        const { amount } = req.body;
        const loan = await Loan.findById(req.params.id).populate("farm");

        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }
        loan.investors.push({
            investor: req.user.id,
            amount,
            date: new Date(),
            status: "pending", 
        });

        await loan.save();
        const user = await User.findById(req.user.id).select("email firstName lastName");
        await sendEmail(
          user.email,
          "Farm IT - Investment Request Submitted",
          `<p><strong>Dear ${user.firstName},</strong></p>
          <p>Your investment request of <strong>${amount}</strong> has been successfully submitted.</p>
          <p>We will notify you once it is verified.</p>
          <p><strong>Best Regards,</strong><br>Farm IT Team</p>`
        );

        res.json({
            message: "Investment request submitted. Awaiting admin verification.",
            loan,
        });
    } catch (error) {
        console.error("Invest in loan error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
},

async verifyInvestment(req, res) {
  try {
      const { loanId, investorId } = req.body;
      const loan = await Loan.findById(loanId);
      if (!loan) return res.status(404).json({ message: "Loan not found" });

      const investor = loan.investors.find(inv => inv.investor.toString() === investorId);
      if (!investor) return res.status(404).json({ message: "Investor not found" });

      if (investor.status !== "pending") {
          return res.status(400).json({ message: "Investment already processed" });
      }

      investor.status = "verified"; 
      await loan.save();

      const user = await User.findById(investorId).select("email firstName");
      await sendEmail(
        user.email,
        "Farm IT - Investment Verified",
        `<p><strong>Dear ${user.firstName},</strong></p>
        <p>Your investment has been successfully verified.</p>
        <p>We will notify you once it is credited.</p>
        <p><strong>Best Regards,</strong><br>Farm IT Team</p>`
      );
      res.status(200).json({ message: "Investment verified successfully." });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
},

async creditInvestment(req, res) {
  try {
      const { loanId, investorId } = req.body;
      const loan = await Loan.findById(loanId).populate("farm");
      if (!loan) return res.status(404).json({ message: "Loan not found" });

      const investor = loan.investors.find(inv => inv.investor.toString() === investorId);
      if (!investor) return res.status(404).json({ message: "Investor not found" });

      if (investor.status !== "verified") {
          return res.status(400).json({ message: "Investment must be verified before crediting" });
      }

      // Mark investment as credited
      investor.status = "credited";

      // Calculate total credited investment
      const totalInvested = loan.investors
          .filter(inv => inv.status === "credited")
          .reduce((sum, inv) => sum + inv.amount, 0);

      // If total invested amount meets or exceeds loan amount, mark loan as approved
      if (totalInvested >= loan.amount) {
          loan.status = "approved";
      }

      await loan.save();

      await Transaction.create({
          loan: loan._id,
          from: investor.investor,
          to: loan.farm.farmer,
          amount: investor.amount,
          type: "investment",
          date: new Date(),
      });
      const investorUser = await User.findById(investorId).select("email firstName");
      const farmerUser = await User.findById(loan.farm.farmer).select("email firstName");
  
      // Send email to investor
      await sendEmail(
        investorUser.email,
        "Farm IT - Investment Credited",
        `<p><strong>Dear ${investorUser.firstName},</strong></p>
        <p>Your investment of <strong>${investor.amount}</strong> has been successfully credited to the farmer's account.</p>
        <p>Thank you for investing in Farm IT.</p>
        <p><strong>Best Regards,</strong><br>Farm IT Team</p>`
      );
  
      // Send email to farmer
      await sendEmail(
        farmerUser.email,
        "Farm IT - Investment Received",
        `<p><strong>Dear ${farmerUser.firstName},</strong></p>
        <p>An investment of <strong>${investor.amount}</strong> has been credited to your farm loan.</p>
        <p>You can now use this amount for your farm operations.</p>
        <p><strong>Best Regards,</strong><br>Farm IT Team</p>`
      );
  
      res.status(200).json({ message: "Investment credited successfully.", loan });
  } catch (error) {
      console.error("Credit investment error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
},

async getPendingInvestments(req, res) {
  try {
    const loans = await Loan.find({ "investors.status": "pending" })
      .populate({
        path: "investors.investor",
        select: "name email", 
      })
      .populate("farm", "name location"); 

    res.status(200).json(loans);
  } catch (error) {
    console.error("Error fetching pending investments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
},
  
};

export default loanController;
