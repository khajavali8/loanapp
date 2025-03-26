// import jwt from 'jsonwebtoken';

// const authenticateUser = (req, res, next) => {
//     let token = req.headers.authorization;
//     if (!token) return res.status(401).json({ message: "Not authorized" });

//     try {
//         const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Invalid token" });
//     }
// };

// export const isAdmin = (req, res, next) => {
//     if (!req.user || req.user.role !== 'admin') {
//         return res.status(403).json({ message: "Admin access required" });
//     }
//     next();
// };

// export const verifyFarmer = (req, res, next) => {
//     if (!req.user.isVerified) {
//       return res.status(403).json({ message: "Your documents are not verified yet." });
//     }
//     next();
//   };
  
// export { authenticateUser };
import jwt from 'jsonwebtoken';
import Document from '../models/Document.js';

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export const verifyFarmer = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const verifiedDocument = await Document.findOne({
      owner: userId,
      isVerified: true
    });

    if (!verifiedDocument) {
      return res.status(403).json({ message: "Your documents are not verified yet." });
    }

    next();
  } catch (error) {
    console.error('Error in verifyFarmer:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
