import Document from '../models/Document.js';
import multer from 'multer';
import path from 'path';
import User from "../models/User.js";
import { sendEmail } from "../utils/emailService.js";


const storage = multer.diskStorage({
  destination: './uploads/documents', 
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|pdf|doc|docx/; 
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, PDF, DOC, and DOCX are allowed.'));
  }
}


const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('document'); // Ensure the form field name is 'document'

const documentController = {
  async uploadDocument(req, res) {
    upload(req, res, async function (err) {
      if (err) {
        console.error("Multer Error:", err.message);
        return res.status(400).json({ message: err.message });
      }
      try {
        if (!req.file) {
          console.error("No file uploaded");
          return res.status(400).json({ message: "No file uploaded" });
        }
  
        console.log("File received:", req.file);
  
        const { title, type, relatedToModel, relatedToId } = req.body;
        if (!title || !type) {
          console.error("Missing required fields");
          return res.status(400).json({ message: "Title and Type are required" });
        }
  
        console.log("User ID:", req.user.id);
  
        const document = await Document.create({
          title,
          type,
          filePath: req.file.path,
          owner: req.user.id,
          relatedTo: relatedToModel && relatedToId ? { model: relatedToModel, id: relatedToId } : undefined,
        });
  
        console.log("Document created:", document);
  
        // Fetch user details
        const user = await User.findById(req.user.id);
        if (!user) {
          console.error("User not found for email notification");
          return res.status(404).json({ message: "User not found" });
        }
  
        // Send Email Notification about Pending Verification
        await sendEmail(
          user.email,
          "Farm IT - Document Verification in Progress",
          `<p><strong>Dear ${user.firstName},</strong></p>
           <p>Your document <strong>${title}</strong> has been uploaded successfully and is currently under review.</p>
           <p>Our team will verify it shortly, and you will receive another email once verification is completed.</p>
           <p>Best Regards,<br>Farm IT Team</p>`
        );
  
        console.log("Verification email sent to:", user.email);
  
        res.status(201).json({ message: "File uploaded successfully. Verification pending.", document });
  
      } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
    });
  }
  ,  
  async getMyDocuments(req, res) {
    try {
      const documents = await Document.find({ owner: req.user.id });
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async deleteDocument(req, res) {
    try {
      const document = await Document.findByIdAndDelete(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },  
  
};

export default documentController;
