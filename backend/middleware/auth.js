const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Adjust the path

require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN); // Use your JWT secret
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found, authorization denied' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = authMiddleware;