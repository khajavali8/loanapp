import User from "../models/User.js";
import Farm from "../models/Farm.js";
import Loan from "../models/Loan.js";
import Document from "../models/Document.js";
import { sendEmail } from "../utils/emailService.js"; 

const userController = {
    async getProfile(req, res) {
      try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    },
  
    async updateProfile(req, res) {
      try {
        const { firstName, lastName } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { firstName, lastName }, { new: true }).select('-password');
        res.json(user);
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    },
  
    async changePassword(req, res) {
      try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!(await bcrypt.compare(currentPassword, user.password))) {
          return res.status(400).json({ message: "Incorrect current password" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: "Password updated successfully" });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    },
  

  async getAllUsers(req, res) {
    try {
      const users = await User.find().select('-password');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async verifyUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.isVerified = true;
      await user.save();

      console.log("Sending verification email to:", user.email);
      await sendEmail(
        user.email,
        "Farm IT - Account Verified",
        `<p><strong>Dear ${user.firstName},</strong></p>
        <p>Your Farm IT account has been successfully verified.</p>
        <p>You can now <a href="http://localhost:3000/login" target="_blank">log in</a> and start using all features.</p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p><strong>Best Regards,</strong><br>Farm IT Team</p>`
      );

      res.status(200).json({ message: "User verified successfully, email sent.", user });

    } catch (error) {
      console.error("Error verifying user:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

    async getAllLoans(req, res) {
      try {
        const loans = await Loan.find()
          .populate({
            path: 'farm',
            select: 'name location farmer',
            populate: { path: 'farmer', select: 'firstName lastName email' } 
          })
          .populate('investors.investor', 'firstName lastName email'); 
    
        res.status(200).json(loans);
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    },
    
    async deleteUser(req, res) {
      try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
    
        res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    },
    

    async getAllFarms(req, res) {
      try {
        const farms = await Farm.find()
          .populate('farmer', 'firstName lastName email')
          .populate('documents'); 
    
        res.status(200).json(farms);
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    },

// Fetch all user documents (only accessible by admin)
async getAllUserDocuments(req, res) {
  try {
    const documents = await Document.find()
      .populate('owner', 'firstName lastName email')
      .populate('relatedTo.id') // Optionally populate related entities (Farm, Loan, User)
      .select('title type filePath owner isVerified');

      documents.forEach(doc => {
        doc.filePath = doc.filePath.replace(/\\/g, '/'); // Fix backslashes
      });
    res.status(200).json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
},
  
// Verify a specific document by ID
async verifyDocument(req, res) {
  const { id } = req.params;

  const document = await Document.findByIdAndUpdate(id, { isVerified: true }, { new: true });
  if (!document) return res.status(404).json({ message: 'Document not found' });

  const user = await User.findByIdAndUpdate(document.owner, { isVerified: true });

  await sendEmail(
    user.email,
    "Farm IT - Document Verified",
    `<p><strong>Dear ${user.firstName},</strong></p>
     <p>Your document <strong>${document.title}</strong> has been successfully verified. 🎉</p>
     <p>You can now proceed with registering farms and requesting loans.</p>
     <p>Best Regards,<br>Farm IT Team</p>`
  );

  res.status(200).json({ message: 'Document verified, user updated.', document, user });
},

};
  
  export default userController;