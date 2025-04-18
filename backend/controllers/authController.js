const jwt = require('jsonwebtoken');
const userModel = require('../models/userSchema');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    console.log("Token at at backend ",token)
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
  
exports.getUserProfile = async (req, res) => {
    try {
      console.log("REQ ",req.user)
      const user = await userModel.findById(req.user.userId).select('-password -__v');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong' });
    }
};